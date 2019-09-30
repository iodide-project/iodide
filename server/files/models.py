from datetime import timedelta

from django.db import models

from ..notebooks.models import Notebook
from ..settings import MAX_FILE_SIZE, MAX_FILE_SOURCE_URL_LENGTH, MAX_FILENAME_LENGTH


class File(models.Model):
    """
    Represents a file saved on the server
    """

    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)
    # FIXME: add a validator for filename (for minimum length and maybe
    # other things)
    filename = models.CharField(max_length=MAX_FILENAME_LENGTH)
    content = models.BinaryField(max_length=MAX_FILE_SIZE)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):  # pragma: no cover
        return self.filename

    class Meta:
        unique_together = ("notebook", "filename")
        verbose_name = "File"
        verbose_name_plural = "Files"
        ordering = ("id",)
        db_table = "file"


class FileSource(models.Model):
    """
    Represents a source for files (an external URL)
    """

    DAILY = timedelta(days=1)
    WEEKLY = timedelta(weeks=1)
    UPDATE_INTERVALS = ((DAILY, "daily"), (WEEKLY, "weekly"))

    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)
    # FIXME: add a validator for filename (for minimum length and maybe
    # other things)
    filename = models.CharField(max_length=MAX_FILENAME_LENGTH)
    url = models.URLField(max_length=MAX_FILE_SOURCE_URL_LENGTH)
    update_interval = models.DurationField(null=True, choices=UPDATE_INTERVALS)

    def __str__(self):  # pragma: no cover
        return self.url

    class Meta:
        unique_together = ("notebook", "filename")
        verbose_name = "File Source"
        verbose_name_plural = "File Sources"
        ordering = ("id",)
        db_table = "file_source"


class FileUpdateOperation(models.Model):
    """
    Represents a pending, ongoing, or completed operation to update a file
    """

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    OPERATION_STATUSES = (
        (PENDING, "pending"),
        (RUNNING, "running"),
        (COMPLETED, "completed"),
        (FAILED, "failed"),
    )

    file_source = models.ForeignKey(FileSource, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    ended_at = models.DateTimeField(null=True)
    status = models.CharField(max_length=32, choices=OPERATION_STATUSES, default=PENDING)
    failure_reason = models.CharField(max_length=128, null=True)

    def __str__(self):  # pragma: no cover
        return "{} update ({})".format(self.file_source, self.OPERATION_STATUSES[self.status][1])

    class Meta:
        verbose_name = "File Update Operation"
        verbose_name_plural = "File Update Operations"
        ordering = ("id",)
        db_table = "file_update_operation"
