from django.db import models
from django.urls import reverse

from server.base.models import User


class Notebook(models.Model):
    """
    The basic notebook model

    Most of the actual content of a notebook is in the notebook revision
    model or table
    """

    MAX_TITLE_LENGTH = 120

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=MAX_TITLE_LENGTH)
    forked_from = models.ForeignKey(
        "NotebookRevision", on_delete=models.SET_NULL, null=True, blank=True, related_name="fork"
    )

    def __str__(self):  # pragma: no cover
        return self.title

    def get_absolute_url(self):
        return reverse("notebook-view", args=[str(self.id)])

    class Meta:
        verbose_name = "Notebook"
        verbose_name_plural = "Notebooks"
        ordering = ("id",)
        db_table = "notebook"


class NotebookRevision(models.Model):
    """
    A revision of a specific notebook
    """

    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE, related_name="revisions")

    title = models.CharField(max_length=Notebook.MAX_TITLE_LENGTH)
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=True)
    is_draft = models.BooleanField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # update notebook's title to be that of this new revision's
        self.notebook.title = self.title
        self.notebook.save()

    def __str__(self):  # pragma: no cover
        return self.title

    class Meta:
        verbose_name = "Notebook Revision"
        verbose_name_plural = "Notebook Revisions"
        ordering = ("-created",)
        db_table = "notebook_revision"
