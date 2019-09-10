import toml

from ..backends import Backend
from ..exceptions import ParametersParseError


class QueryBackend(Backend):
    """
    A remote kernel to query against a remote source
    such as Redash.
    """

    # The name of the backend in the backend registry
    token = "query"

    def parse_chunk(self, notebook, chunk):
        """
        Parse the incoming remote chunk content as TOML and return a
        dict with the values, e.g.::

            data_source = telemetry
            output_name = result
            filename = user_count_query.json
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
        parameters, snippet = self.split(chunk)

        try:
            parsed = toml.loads(parameters)
        except (TypeError, toml.TomlDecodeError) as exc:
            raise ParametersParseError from exc

        filename = parsed.pop("filename")
        if filename is None:
            filename = self.build_filename(notebook, chunk)

        parsed.update({"snippet": snippet, "filename": filename})
        return parsed

    def execute_operation(self, *args, **kwargs):
        """
        Executes the remote operation using the provided parameters
        on the remote kernel and returns the results.
        """
        # TODO: given the provided parameters build the request to Redash,
        # wait for the results and return them as a streaming object
        # to be saved as a file
        return b"faaaaaaaake!"
