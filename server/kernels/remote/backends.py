import hashlib
from abc import ABCMeta, abstractmethod

from class_registry import ClassRegistry, RegistryKeyError
from django.db import transaction
from django.utils import timezone

from ...files.models import File
from .exceptions import BackendError
from .models import RemoteOperation
from .tasks import execute_remote_operation

# A simple explicit remote kernel registry,
# TODO: can be turned into an EntryPointClassRegistry later
# when remote kernels are abstracted out of iodide
registry = ClassRegistry(attr_name="token")


def get_backend(token, exc_cls=BackendError):
    """
    Return the backend with the given token or raise the given exception.
    """
    try:
        return registry[token]
    except RegistryKeyError as exc:
        raise exc_cls from exc


class Backend(metaclass=ABCMeta):
    """
    The base class for all kernels that use a remote
    service for evaluating a notebook chunk.
    """

    #: The string by which the remote chunk is devided in parameters and content
    REMOTE_CHUNK_DIVIDER = "-----"

    @abstractmethod
    def parse_chunk(self, notebook, chunk):
        """
        Given the notebook object and the content of a remote chunk
        this should return a dictionary in the format:

        {
            "parameters: {
                "output_name": "results",
            },
            "filename": "file/name.txt",
            "snippet": "SELECT 1",
        }
        """

    @abstractmethod
    def execute_operation(self, *args, **kwargs):
        """
        Executes the remote operation using the provided parameters
        on the remote kernel and returns the results.
        """

    def build_filename(self, notebook, chunk):
        """
        Given a notebook and chunk content string build a filename
        to save a result in.

        Uses the format "<MD5 hash of chunk content>.ioresult", e.g.
        "a1d0c6e83f027327d8461063f4ac58a6.ioresult"
        """
        chunk_hash = hashlib.md5(chunk.encode()).hexdigest()
        return f"{chunk_hash}.ioresult"

    def split_chunk(self, chunk):
        """
        Splits the provided chunk content by a divider once and returns the result
        """
        header, body = chunk.split(self.REMOTE_CHUNK_DIVIDER, 1)
        return [header, body.strip()]

    def create_operation(self, notebook, **params):
        """
        Creates the remote operation in the database for later retrieval
        """
        return RemoteOperation.objects.create(notebook_id=notebook.id, **params)

    def save_result(self, operation, content):
        """
        Given the provided remote operation and resulting content
        create a new remote file object.
        """
        try:
            # See if we've previously saved a result in a file
            # with the provided filename and notebook
            with transaction.atomic():
                remote_file = File.objects.get(
                    notebook_id=operation.notebook_id, filename=operation.filename
                )
                remote_file.content = content
                remote_file.remote_operation = operation
                remote_file.save()
        except File.DoesNotExist:
            # or create it newly instead
            with transaction.atomic():
                remote_file = File.objects.create(
                    notebook=operation.notebook,
                    filename=operation.filename,
                    content=content,
                    remote_operation=operation,
                )
        return remote_file

    def refresh_file(self, remote_file):
        """
        Refresh the provided remote file using the last operation's
        parameters.
        """
        with transaction.atomic():
            operation = self.create_operation(
                notebook=remote_file.notebook,
                # TODO: use name of remote file and not from remote operation in
                # case we ever want to implement renaming files?
                filename=remote_file.filename,
                backend=remote_file.remote_operation.backend,
                snippet=remote_file.remote_operation.snippet,
                parameters=remote_file.remote_operation.parameters,
            )

            # TODO: make this use the Celery task API
            transaction.on_commit(lambda: execute_remote_operation(pk=operation.pk))

            transaction.on_commit(
                # Record when the file was refreshed
                lambda: File.objects.filter(pk=remote_file.pk).update(refreshed_at=timezone.now())
            )

            return operation
