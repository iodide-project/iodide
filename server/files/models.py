from django.db import models
from ..notebooks.models import Notebook
from ..settings import (MAX_FILE_SIZE,
                        MAX_FILENAME_LENGTH)


class File(models.Model):
    '''
    Represents a file saved on the server
    '''
    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)
    # FIXME: add a validator for filename (for minimum length and maybe
    # other things)
    filename = models.CharField(max_length=MAX_FILENAME_LENGTH)
    content = models.BinaryField(max_length=MAX_FILE_SIZE)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):  # pragma: no cover
        return self.filename

    class Meta:
        unique_together = ('notebook', 'filename')
        verbose_name = "File"
        verbose_name_plural = "Files"
        ordering = ("id",)
