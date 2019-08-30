from abc import ABCMeta, abstractmethod

from class_registry import ClassRegistry

from server.files.models import File


# A simple explicit remote kernel registry,
# TODO: can be turned into an EntryPointClassRegistry later
# when remote kernels are abstracted out of iodide
registry = ClassRegistry(attr_name="token")


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
        """
        # TODO: implement sensible computed filename from given notebook and chunk content
        return "foo.bar"

    def split_chunk(self, chunk):
        """
        Splits the provided chunk content by a divider once and returns the result
        """
        return chunk.split(self.REMOTE_CHUNK_DIVIDER, 1)

    def save_result(self, notebook, filename, content):
        """
        Given the provided notebook, filename and content
        create a new file object.

        TODO: It may make sense to create a separate RemoteFile
        that contains some of the metadata that the file was created
        with originally.

        TODO: Should this be marked with a "remote" flag somehow to
        show up in a separate tab of the file modal?
        """
        return File.objects.create(
            notebook=notebook,
            filename=filename,
            content=content,
        )
