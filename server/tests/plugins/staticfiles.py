"""
A Pytest plugin to automatically run Django's collectstatic management command.
"""
import pytest
from django.core.management import call_command


def pytest_addoption(parser):
    parser.addoption(
        "--staticfiles", action="store_true", dest="staticfiles", help="Collect Django staticfiles"
    )
    parser.addoption(
        "--no-staticfiles",
        action="store_false",
        dest="staticfiles",
        help="Don't collect Django staticfiles",
    )


@pytest.fixture(scope="session", autouse=True)
def collectstatic(request):
    if request.config.getoption("--staticfiles"):
        call_command("collectstatic", link=True, verbosity=2, interactive=False)
