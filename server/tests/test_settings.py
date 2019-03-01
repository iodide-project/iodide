from server.urls import parse_redirects


def test_parse_redirects():
    content = "docs/= http://iodide-project.github.io/docs/;dist/=http://google.com"
    redirects = list(parse_redirects(content))

    docs, dist = redirects

    assert docs.pattern._regex == "^docs/.*"
    assert docs.callback.view_initkwargs["url"] == "http://iodide-project.github.io/docs/"

    assert dist.pattern._regex == "^dist/.*"
    assert dist.callback.view_initkwargs["url"] == "http://google.com"
