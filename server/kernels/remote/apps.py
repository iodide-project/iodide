from django.apps import AppConfig
from django.core.exceptions import ImproperlyConfigured
from django.utils.module_loading import import_string


class RemoteKernelConfig(AppConfig):
    def ready(self):
        """
        Called when the Django setup is run and auto-registers
        remote kernel backends against the remote kernels registry.
        """
        backend = getattr(self, "backend", None)
        if backend is None:
            raise ImproperlyConfigured(
                f"The RemoteKernelConfig {self.name} requires a backend "
                f"attribute set to populate the remote kernel registry."
            )
        from . import backends

        backend = import_string(self.backend)
        backends.registry.register(backend)
