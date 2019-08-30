from django.apps import AppConfig
from django.core.exceptions import ImproperlyConfigured


class RemoteKernelConfig(AppConfig):

    def ready(self):
        """
        Called when the Django setup is run and auto-registers
        remote kernel backends against the remote kernels registry.
        """
        backend = getattr(self, "backend", None)
        if backend is None:
            raise ImproperlyConfigured(
                f"The RemoteKernelConfig {self.name} requires a backend attribute set to populate the remote kernel registry."
            )
        from . import backends
        backends.registry.register(backend)


class RemoteConfig(AppConfig):
    name = "kernels.remote"
    verbose_name = "Remote Kernels"
