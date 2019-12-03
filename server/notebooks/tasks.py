from collections import defaultdict
from datetime import datetime, timedelta

import pytz
from spinach import Tasks

from ..settings import NOTEBOOK_REVISION_FIXED_WINDOW_LENGTH_SECS
from .models import NotebookRevision

tasks = Tasks()


@tasks.task(name="notebooks:execute_notebook_revisions_cleanup")
def execute_notebook_revisions_cleanup(notebook_id, now_utc=None):
    """Prune revision hisotry.

    Prune revision history so that there is only one revision in each
    time window, also marking draft revisions that older than window length
    as non-draft.

    * Time window: This task groups draft revisions into fixed-size windows
      (alsocalled Tumbling windows).
    """
    draft_revisions = NotebookRevision.objects.filter(notebook_id=notebook_id, is_draft=True)
    now_utc = now_utc or datetime.now(tz=pytz.utc)

    # group notebook revisions into fixed-size windows
    revision_groups = defaultdict(list)
    for revision in draft_revisions:
        key = int(revision.created.timestamp()) // NOTEBOOK_REVISION_FIXED_WINDOW_LENGTH_SECS
        revision_groups[key].append(revision)
    revision_windows = [revision_groups[k] for k in sorted(revision_groups.keys(), reverse=True)]

    threshold = timedelta(seconds=NOTEBOOK_REVISION_FIXED_WINDOW_LENGTH_SECS)
    # delete intermediate revisions
    intermediate_revision_ids = [
        revision.id
        for revision_window in revision_windows
        for revision in revision_window[1:]
        if now_utc - revision.created >= threshold
    ]
    NotebookRevision.objects.filter(id__in=intermediate_revision_ids).delete()

    # mark remaining old revisions as non-draft
    non_draft_revision_ids = [
        revision_window[0].id
        for revision_window in revision_windows
        if now_utc - revision_window[0].created >= threshold
    ]
    NotebookRevision.objects.filter(id__in=non_draft_revision_ids).update(is_draft=False)
