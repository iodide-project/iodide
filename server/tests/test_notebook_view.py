import pytest
from django.urls import reverse

from helpers import get_script_block
from server.notebooks.models import (Notebook,
                                     NotebookRevision)


def test_notebook_view(client, test_notebook):
    initial_revision = NotebookRevision.objects.filter(notebook=test_notebook).last()
    resp = client.get(reverse('notebook-view', args=[str(test_notebook.id)]))
    assert resp.status_code == 200
    expected_content = '<script id="jsmd" type="text/jsmd">{}</script>'.format(
        initial_revision.content)
    assert expected_content in str(resp.content)

    # add a new revision, verify that a fresh load gets it
    new_revision_content = 'My new fun content'
    NotebookRevision.objects.create(
        content=new_revision_content,
        notebook=test_notebook,
        title='Second revision')
    resp = client.get(reverse('notebook-view', args=[str(test_notebook.id)]))
    assert resp.status_code == 200
    new_expected_content = '<script id="jsmd" type="text/jsmd">{}</script>'.format(
        new_revision_content)
    assert new_expected_content in str(resp.content)


@pytest.mark.parametrize("logged_in", [True, False])
def test_new_notebook_view(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)

    response = client.get(reverse('new-notebook'), follow=True)
    (last_url, _) = response.redirect_chain[-1]
    if logged_in:
        assert NotebookRevision.objects.count() == 1
        assert Notebook.objects.count() == 1
        assert last_url == Notebook.objects.all()[0].get_absolute_url()
    else:
        assert NotebookRevision.objects.count() == 0
        assert Notebook.objects.count() == 0
        assert last_url == reverse('try-it')


@pytest.mark.parametrize("logged_in", [True, False])
def test_tryit_view(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)
    response = client.get(reverse('try-it'), follow=True)

    if logged_in:
        # if we are logged in, this view should redirect to /new`
        assert NotebookRevision.objects.count() == 1
        assert Notebook.objects.count() == 1
        assert len(response.redirect_chain) == 2
        (last_url, _) = response.redirect_chain[-1]
        assert last_url == Notebook.objects.all()[0].get_absolute_url()
    else:
        # if we are not logged in, all the action should happen on the
        # client
        assert NotebookRevision.objects.count() == 0
        assert Notebook.objects.count() == 0
        assert len(response.redirect_chain) == 0


def test_notebook_revisions_page(fake_user, test_notebook, client):
    # create another notebook revision
    NotebookRevision.objects.create(
        notebook=test_notebook,
        title="second revision",
        content="*fake notebook content 2*")
    resp = client.get(reverse('notebook-revisions', args=[str(test_notebook.id)]))
    assert get_script_block(resp.content, 'pageData') == {
        'files': [],
        'ownerInfo': {
            'avatar': None,
            'full_name': fake_user.get_full_name(),
            'notebookId': test_notebook.id,
            'title': test_notebook.title,
            'username': fake_user.username
        },
        'revisions': [
            {
                'date': r.created.isoformat(),
                'id': r.id,
                'notebookId': test_notebook.id,
                'title': r.title
            } for r in NotebookRevision.objects.filter(
                notebook_id=test_notebook.id)
        ],
        'userInfo': {}
    }
