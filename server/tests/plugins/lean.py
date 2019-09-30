OPTIONAL_PLUGINS = ["_cov", "flake8", "isort"]


def pytest_addoption(parser):
    parser.addoption(
        "--lean",
        action="store_true",
        default=False,
        help="Set if this is running in a CI environment.",
    )


def pytest_configure(config):
    """Hook implementation that unregisters optional plugins if "--ci" is specified."""
    lean = config.getoption("--lean")

    if not lean:
        return

    for optional_plugin in OPTIONAL_PLUGINS:
        config.pluginmanager.unregister(name=optional_plugin)
