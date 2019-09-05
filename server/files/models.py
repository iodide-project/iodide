from datetime import timedelta

from django.db import models

from ..notebooks.models import Notebook
from ..settings import MAX_FILE_SIZE, MAX_FILE_SOURCE_URL_LENGTH, MAX_FILENAME_LENGTH


class BaseFile(models.Model):
    """
    The abstract base model for files
    """

    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)
    # FIXME: add a validator for filename (for minimum length and maybe
    # other things)
    filename = models.CharField(max_length=MAX_FILENAME_LENGTH)

    def __str__(self):  # pragma: no cover
        return self.filename

    class Meta:
        abstract = True
        unique_together = ("notebook", "filename")
        ordering = ("id",)


class BaseContentFile(BaseFile):
    content = models.BinaryField(max_length=MAX_FILE_SIZE)

    class Meta(BaseFile.Meta):
        abstract = True


class File(BaseContentFile):
    """
    Represents a file saved on the server
    """

    last_updated = models.DateTimeField(auto_now=True)

    class Meta(BaseContentFile.Meta):
        verbose_name = "File"
        verbose_name_plural = "Files"
        db_table = "file"


class FileSource(BaseFile):
    """
    Represents a source for files (an external URL)
    """

    DAILY = timedelta(days=1)
    WEEKLY = timedelta(weeks=1)
    UPDATE_INTERVALS = ((DAILY, "daily"), (WEEKLY, "weekly"))

    url = models.URLField(max_length=MAX_FILE_SOURCE_URL_LENGTH)
    update_interval = models.DurationField(null=True, choices=UPDATE_INTERVALS)

    def __str__(self):  # pragma: no cover
        return self.url

    class Meta(BaseFile.Meta):
        verbose_name = "File Source"
        verbose_name_plural = "File Sources"
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
        (PENDING, "Pending"),
        (RUNNING, "Running"),
        (COMPLETED, "Completed"),
        (FAILED, "Failed"),
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
