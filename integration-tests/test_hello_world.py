import environ


def test_hello_world(selenium):
    base_url = environ.Env()("DOCKER_ORIGIN")
    selenium.get(base_url)
    assert selenium.title == "Iodide"
