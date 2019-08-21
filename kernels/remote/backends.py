import toml
from class_registry import AutoRegister, ClassRegistry
from six import with_metaclass

from server.files.models import File
from .exceptions import ParametersParseError


REMOTE_CHUNK_CONTENT_DIVIDER = "-----"

# A simple explicit remote kernel registry,
# TODO: can be turned into an EntryPointClassRegistry later
# when remote kernels are abstracted out of iodide
remote_kernels = ClassRegistry()


class RemoteKernel(with_metaclass(AutoRegister(remote_kernels))):
    """
    The base class for all kernels that use a remote
    service for evaluating a notebook chunk.
    """
    def save(self, notebook, filename, content):
        """
        Given the provided notebook, filename and content
        create a new file object.

        TODO: It may make sense to create a separate RemoteFile
        that contains some of the metadata that the file was created
        with originally.

        TODO: Should this be marked with a "remote" flag somehow to
        show up in a separate tab of the file modal?
        """
        File.objects.create(
            notebook=notebook,
            filename=filename,
            content=content,
        )


class QueryRemoteKernel(RemoteKernel):
    """
    A remote kernel to query against a remote source
    such as Redash.

    """
    #: The name of the remote kernel used in the registry for reverse lookups.
    element = "query"

    def filename(self, notebook, content):
        # TODO: implement sensible computed filename from given notebook and content
        return "foo.bar"

    def parse(self, notebook, content):
        """
        Parse the incoming remote chunk content as TOML and return a
        dict with the values, e.g.::

            data_source = telemetry
            output_name = result
            filename = user_count_query.json
            -----
            select count(*) from telemetry.users
            -----
            select count(*) from telemetry.users

        will return:

            {
                "parameters": {
                    "data_source": "telemetry",
                    "output_name": "result",
                },
                "filename": "user_count_query.json",
                "snippet": "select count(*) from telemetry.users",
            }
        """
        parameters, snippet = content.split(REMOTE_CHUNK_CONTENT_DIVIDER, 1)

        try:
            parsed = toml.loads(parameters)
        except (TypeError, toml.TomlDecodeError) as exc:
            raise ParametersParseError from exc

        filename = parsed.pop("filename")
        if filename is None:
            # calculate the filename if it wasn't provided
            # TODO: check if this is something we really want, product-wise
            filename = self.filename(notebook, content)

        parsed.update({
            "snippet": snippet,
            "filename": filename,
        })
        return parsed

    def execute(self, *args, **kwargs):
        """
        Executes the remote operation using the provided parameters
        on the remote kernel and returns the results.
        """
        # TODO: given the provided parameters build the request to Redash,
        # wait for the results and return them as a streaming object
        # to be saved as a file
