from django.apps import AppConfig


class RemoteKernels(AppConfig):
    name = "kernels.remote"
    verbose_name = "Remote Kernels"

    def ready(self):
        """
        Loads all kernels as configured.
        """
