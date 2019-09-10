from ..apps import RemoteKernelConfig


class QueryConfig(RemoteKernelConfig):
    """
    The Django app config for the query remote kernel backend.
    """

    name = "server.kernels.remote.query"
    verbose_name = "Query Remote Kernel"
    backend = "server.kernels.remote.query.backends.QueryBackend"
