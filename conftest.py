"""
The global Pytest config file, here in the root to successfully load
the custom Pytest plugins.
"""

pytest_plugins = ["server.tests.plugins.lean", "server.tests.plugins.staticfiles"]
