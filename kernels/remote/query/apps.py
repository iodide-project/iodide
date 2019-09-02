from ..apps import RemoteKernelConfig


class QueryConfig(RemoteKernelConfig):
    name = "kernels.remote.query"
    verbose_name = "Query Remote Kernel"
    backend = "kernels.remote.query.backends.QueryBackend"
