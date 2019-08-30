from ..apps import RemoteKernelConfig
from .backend import QueryBackend


class QueryConfig(RemoteKernelConfig):
    name = "kernels.remote.query"
    verbose_name = "Query Remote Kernel"
    backend = QueryBackend
