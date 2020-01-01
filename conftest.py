"""
The global Pytest config file, here in the root to successfully load
the custom Pytest plugins.
"""

import pytest

pytest_plugins = ["server.tests.plugins.lean", "server.tests.plugins.staticfiles"]

@pytest.fixture
def chrome_options(chrome_options):
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    return chrome_options
