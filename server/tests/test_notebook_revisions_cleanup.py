from datetime import datetime
from unittest.mock import call, patch

import pytest
import pytz
from django.urls import reverse

from server.notebooks.models import Notebook, NotebookRevision
from server.notebooks.tasks import execute_notebook_revisions_cleanup

# sorted by time asc
CREATED_DATETIMES = [
    # 10:13
    datetime(2019, 11, 20, 10, 13, 10, tzinfo=pytz.utc),
    datetime(2019, 11, 20, 10, 13, 40, tzinfo=pytz.utc),
    # 10:14
    datetime(2019, 11, 20, 10, 14, 10, tzinfo=pytz.utc),
    datetime(2019, 11, 20, 10, 14, 30, tzinfo=pytz.utc),
    datetime(2019, 11, 20, 10, 14, 40, tzinfo=pytz.utc),
    # 10:15
    datetime(2019, 11, 20, 10, 15, 10, tzinfo=pytz.utc),
    datetime(2019, 11, 20, 10, 15, 40, tzinfo=pytz.utc),
]
NOW_UTC = datetime(2019, 11, 20, 10, 15, 50, tzinfo=pytz.utc)


@pytest.fixture
def notebook_and_draft_revisions(fake_user):
    notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook")
    notebook_revisions = []

    for i, created in enumerate(CREATED_DATETIMES):
        revision = NotebookRevision.objects.create(
            notebook=notebook,
            title=f"Revision {i}",
            content=f"fake notebook content for revision {i}",
            is_draft=True,
        )
        revision.created = created
        revision.save()
        notebook_revisions.append(revision)

    return notebook, notebook_revisions


def test_execute_notebook_revisions_cleanup(notebook_and_draft_revisions):
    notebook, revisions = notebook_and_draft_revisions

    # execute
    execute_notebook_revisions_cleanup(notebook.id, NOW_UTC)

    # verify
    updated_revisions = NotebookRevision.objects.filter(notebook=notebook)

    assert len(updated_revisions) == 4

    assert updated_revisions[0].is_draft
    assert updated_revisions[0].created == CREATED_DATETIMES[-1]
    assert updated_revisions[1].is_draft
    assert updated_revisions[1].created == CREATED_DATETIMES[-2]

    assert not updated_revisions[2].is_draft
    assert updated_revisions[2].created == CREATED_DATETIMES[-3]

    assert not updated_revisions[3].is_draft
    assert updated_revisions[3].created == CREATED_DATETIMES[-6]


def test_execute_notebook_revisions_cleanup_is_scheduled(fake_user, test_notebook, client):
    last_revision = NotebookRevision.objects.filter(notebook_id=test_notebook.id).first()
    post_blob = {
        "parent_revision_id": last_revision.id,
        "title": "My cool notebook",
        "content": "*modified test content",
    }

    with patch("server.notebooks.tasks.tasks.schedule") as mock_schedule:
        client.force_login(user=fake_user)
        resp = client.post(
            reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
        )
        assert resp.status_code == 201

        # also make sure we queued the relevant async tasks
        mock_schedule.assert_has_calls([call(execute_notebook_revisions_cleanup, test_notebook.id)])
