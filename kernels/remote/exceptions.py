class RemoteKernelException(Exception):
    """
    The base exception so we can easily filter out exceptions.
    """


class RemoteOperationMissing(RemoteKernelException):
    """
    The exception for when a RemoteOperation object can't be found in the
    database.
    """


class ParametersParseError(RemoteKernelException):
    """
    The exception for when the parameters sent from the client
    side can't be parsed successfully.
    """


class ExecutionError(RemoteKernelException):
    """
    The exception for when the parameters sent from the client
    side can't be parsed successfully.
    """
