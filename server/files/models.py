from django.db import models

from ..notebooks.models import Notebook
from ..settings import MAX_FILE_SIZE, MAX_FILENAME_LENGTH


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


class FileSource(models.Model):
    """
    Represents a source for files (an external URL)
    """
    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)
    # FIXME: add a validator for filename (for minimum length and maybe
    # other things)
    filename = models.CharField(max_length=MAX_FILENAME_LENGTH)
    url = models.URLField()
    update_interval = models.DurationField(null=True)

    def __str__(self):  # pragma: no cover
        return self.source

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
    PENDING = 0
    RUNNING = 1
    COMPLETED = 2
    FAILED = 3
    OPERATION_STATUSES = ((SUBMITTED, "submitted"),
                          (PENDING, "pending"),
                          (RUNNING, "running"),
                          (COMPLETED, "completed"),
                          (FAILED, "failed"))

    file_source = models.ForeignKey(FileSource, on_delete=models.CASCADE)
    started = models.DateTimeField(auto_now_add=True)
    ended = models.DateTimeField(null=True)
    status = models.IntegerField(choices=OPERATION_STATUSES, default=PENDING)

    def __str__(self):  # pragma: no cover
        return '{} update ({})'.format(file_source, OPERATION_STATUSES[self.status][1])

    class Meta:
        verbose_name = "File Update Operation"
        verbose_name_plural = "File Update Operations"
        ordering = ("id",)
        db_table = "file_operation"
