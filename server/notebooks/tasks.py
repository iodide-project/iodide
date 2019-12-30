from collections import defaultdict
from datetime import datetime, timedelta

import pytz
from spinach import Tasks

from ..settings import NOTEBOOK_REVISION_SAVE_INTERVAL_SECS
from .models import NotebookRevision

tasks = Tasks()


@tasks.task(name="notebooks:execute_notebook_revisions_cleanup")
def execute_notebook_revisions_cleanup(notebook_id, now_utc=None):
    """Prune revision hisotry.

    Prune revision history so that there is only one revision in each
    time window, also marking draft revisions that older than window length
    as non-draft. See also: "tumbling windows"

    * Time window: This task groups draft revisions into fixed-size windows
      (also called Tumbling windows).
    """
    draft_revisions = NotebookRevision.objects.filter(notebook_id=notebook_id, is_draft=True)
    try:
        latest_non_draft_revision = NotebookRevision.objects.filter(
            notebook_id=notebook_id, is_draft=False
        ).latest("created")
    except NotebookRevision.DoesNotExist:
        latest_non_draft_revision = None

    # group notebook revisions into fixed-size windows
    revision_groups = defaultdict(list)
    for revision in draft_revisions:
        key = int(revision.created.timestamp()) // NOTEBOOK_REVISION_SAVE_INTERVAL_SECS
        revision_groups[key].append(revision)
    revision_windows = [revision_groups[k] for k in sorted(revision_groups.keys())]

    now_utc = now_utc or datetime.now(tz=pytz.utc)
    threshold = timedelta(seconds=NOTEBOOK_REVISION_SAVE_INTERVAL_SECS)

    # get intermediate revisions
    intermediate_revision_ids = [
        revision.id for revision_window in revision_windows for revision in revision_window[1:]
    ]
    # for remaining_revisions, if a revision is same as the previous one (issue #2517), then
    # also add it to the intermediate revisions.
    remaining_revisions = [revision_window[0] for revision_window in revision_windows]
    last_revision = latest_non_draft_revision
    for revision in remaining_revisions:
        if (
            last_revision
            and last_revision.title == revision.title
            and last_revision.content == revision.content
        ):
            intermediate_revision_ids.append(revision.id)
        else:
            last_revision = revision
    # delete intermediate revisions
    NotebookRevision.objects.filter(
        id__in=intermediate_revision_ids, created__lt=now_utc - threshold
    ).delete()

    # mark remaining old revisions as non-draft
    NotebookRevision.objects.filter(id__in=draft_revisions, created__lt=now_utc - threshold).update(
        is_draft=False
    )
