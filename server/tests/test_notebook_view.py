from django.urls import reverse

from server.notebooks.models import NotebookRevision


def test_notebook_view(client, test_notebook):
    initial_revision = NotebookRevision.objects.filter(notebook=test_notebook).last()
    resp = client.get(reverse('notebook-view', args=[str(test_notebook.id)]))
    assert resp.status_code == 200
    expected_content = '<script id="jsmd" type="text/jsmd">{}</script>'.format(
        initial_revision.content)
    assert expected_content in str(resp.content)
