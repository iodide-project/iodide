import datetime
import logging

import requests
from django.conf import settings
from django.utils import timezone

from ..celery import celery
from .models import File, FileSource, FileUpdateOperation

logger = logging.getLogger(__name__)


@celery.task
def execute_file_update_operation(update_operation_id):
    update_operation = FileUpdateOperation.objects.get(id=update_operation_id)

    # set status to RUNNING
    update_operation.status = FileUpdateOperation.RUNNING
    update_operation.started_at = timezone.now()
    update_operation.save()

    # actually run the query against the URL
    file_source = update_operation.file_source
    try:
        logger.info("Fetching file resource %s for notebook %s", file_source, file_source.notebook)
        request = requests.get(file_source.url, stream=True)
        request.raise_for_status()
        content = request.raw.read(settings.MAX_FILE_SIZE + 1, decode_content=True)
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
    except (requests.exceptions.RequestException, ValueError) as e:
        update_operation.status = FileUpdateOperation.FAILED
        update_operation.failure_reason = str(e)

    update_operation.ended_at = timezone.now()
    update_operation.save()


@celery.task
def execute_scheduled_file_operations():
    # this runs once a day, always queue daily operations
    intervals_to_queue = [datetime.timedelta(days=1)]
    # if it is monday, include the weekly ones as well
    if datetime.datetime.today().weekday() == 0:
        intervals_to_queue.append(datetime.timedelta(weeks=1))

    logger.info(
        "Running scheduled file operations (intervals: %s)",
        ", ".join(str(i) for i in intervals_to_queue),
    )
    file_sources = FileSource.objects.filter(update_interval__in=intervals_to_queue)
    for file_source in file_sources:
        update_operation = FileUpdateOperation.objects.create(file_source=file_source)
        execute_file_update_operation.apply_async(args=[update_operation.id])
