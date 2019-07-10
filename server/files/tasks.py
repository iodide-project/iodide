import logging

import requests
from django.conf import settings

from ..celery import celery
from .models import File, FileUpdateOperation

logger = logging.getLogger(__name__)


@celery.task
def execute_file_update_operation(update_operation_id):
    update_operation = FileUpdateOperation.objects.get(id=update_operation_id)

    # set status to RUNNING
    update_operation.status = FileUpdateOperation.RUNNING
    update_operation.save()

    # actually run the query against the URL
    file_source = update_operation.file_source
    try:
        request = requests.get(file_source.url, stream=True)
        request.raise_for_status()
        content = request.raw.read(settings.MAX_FILE_SIZE + 1)
        if len(content) > settings.MAX_FILE_SIZE:
            raise ValueError("File too large")
        try:
            file = File.objects.get(notebook=file_source.notebook, filename=file_source.filename)
            file.content = content
            file.save()
        except File.DoesNotExist:
            File.objects.create(
                notebook=file_source.notebook, filename=file_source.filename, content=content
            )
        update_operation.status = FileUpdateOperation.COMPLETED
        update_operation.save()
    except ValueError as e:
        update_operation.status = FileUpdateOperation.FAILED
        update_operation.failure_reason = str(e)
        update_operation.save()
