class RemoteException(Exception):
    """
    The base exception so we can easily filter out exceptions.
    """


class MissingOperation(RemoteException):
    """
    The exception for when a RemoteOperation object can't be found in the
    database.
    """


class ParametersParseError(RemoteException):
    """
    The exception for when the parameters sent from the client
    side can't be parsed successfully.
    """


class ExecutionError(RemoteException):
    """
    The exception for when the parameters sent from the client
    side can't be parsed successfully.
    """


class BackendError(RemoteException):
    """
    The exception for when loading or instantiating a remote
    kernel backend fails.
    """
