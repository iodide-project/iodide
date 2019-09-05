from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField

from server.files.models import BaseContentFile
from server.notebooks.models import Notebook


class RemoteOperation(models.Model):
    """
    A parsed remote chunk to be used when fetching data from remote kernel.
    """

    STATUS_PENDING = "pending"
    STATUS_RUNNING = "running"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"
    STATUSES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_RUNNING, "Running"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
    )
    notebook = models.ForeignKey(
        Notebook,
        on_delete=models.CASCADE,
        related_name="remote_operations",
        help_text="A back-reference for use in the file modal",
    )
    status = models.CharField(
        choices=STATUSES,
        default=STATUS_PENDING,
        max_length=10,
        help_text="The status of the remote operation, string-based for easier inspection",
    )

    backend = models.CharField(
        max_length=24, help_text="The slug of the remote kernel backend, e.g. 'query'"
    )
    parameters = JSONField(
        help_text="The parameters as provided as part of the remote chunk content"
    )

    # TODO: we need to validate this and also provide a view to check availability
    filename = models.CharField(
        max_length=settings.MAX_FILENAME_LENGTH,
        blank=True,
        null=True,
        help_text="The filename as provided as part of the remote chunk content",
    )

    snippet = models.TextField(
        help_text="The actual snippet to be sent to the remote kernel for processing, e.g a SQL query"
    )

    scheduled_at = models.DateTimeField(
        auto_now_add=True, help_text="The datetime when the remote operation was first created"
    )
    started_at = models.DateTimeField(
        blank=True, null=True, help_text="The datetime when the remote operation started running"
    )
    ended_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="The datetime when the remote operation was completed successfully",
    )
    failed_at = models.DateTimeField(
        blank=True, null=True, help_text="The datetime when the remote operation failed at"
    )

    def __str__(self):
        return self.pk

    class Meta:
        verbose_name = "Remote Operation"
        verbose_name_plural = "Remote Operations"
        unique_together = ("notebook", "filename")
        ordering = ("-scheduled_at",)


class RemoteFile(BaseContentFile):
    """
    Represents a file saved on the server with content
    fetched from a remote kernel
    """
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="The datetime when the remote file was first created"
    )
    refreshed_at = models.DateTimeField(
        auto_now_add=True, help_text="The datetime when the remote file was last refreshed at"
    )
    operation = models.ForeignKey(RemoteOperation, on_delete=models.CASCADE)

    class Meta(BaseContentFile.Meta):
        verbose_name = "Remote file"
        verbose_name_plural = "Remote files"
