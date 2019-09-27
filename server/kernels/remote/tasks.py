import logging

from django.db import transaction
from django.utils import timezone

from ...celery import celery
from . import backends
from .exceptions import ExecutionError, MissingOperation
from .models import RemoteOperation

logger = logging.getLogger(__name__)


@celery.task
def execute_remote_operation(pk):
    """
    A task to execute a remote operation and store the result
    in a file under the provided name.
    """
    operation_queryset = RemoteOperation.objects.filter(pk=pk)
    # first check if there is a remote operation on file
    # to catch transaction issues or other side effects
    operation = operation_queryset.first()
    if operation is None:
        logger.error("Remote operation %s not found", pk)
        raise MissingOperation

    with transaction.atomic():
        # then update the remote operation that it's running
        operation_queryset.update(status=RemoteOperation.STATUS_RUNNING, started_at=timezone.now())

    # instantiate the backend for the given operation
    backend = backends.get_backend(operation.backend)
    logger.info("Remote operation %s started using backend %s", pk, operation.backend)

    # then execute the remote operation with the given snippet and all other
    # parameters
    try:
        result = backend.execute_operation(snippet=operation.snippet, **operation.parameters)
    except Exception as exc:
        with transaction.atomic():
            operation_queryset.update(
                status=RemoteOperation.STATUS_FAILED, failed_at=timezone.now()
            )
        logger.error("Remote operation %s failed", pk, exc_info=True)
        raise ExecutionError from exc

    # and safe the result as a Iodide file, the result should be a
    # memory effecient iterator, e.g. a streaming response
    backend.save_result(operation, result)
    logger.info("Remote operation %s is storing its result", pk, operation.backend)

    with transaction.atomic():
        # then update the remote operation that it was completed
        operation_queryset.update(status=RemoteOperation.STATUS_COMPLETED, ended_at=timezone.now())
    logger.info("Remote operation %s finished using backend %s", pk, operation.backend)
