import json
import re
from server.notebooks.models import Notebook

from django.urls import reverse


def _get_page_data(page_content_str):
    m = re.search(r'<script id="pageData" type="application/json">(\{.*\})</script>', str(page_content_str))
    return json.loads(m.group(1))


def test_index_view(client, two_test_notebooks):
    resp = client.get(reverse('index'))
    assert resp.status_code == 200
    assert set(_get_page_data(str(resp.content)).keys()) == set(['userInfo',
                                                                 'notebookList'])


def test_user_view(client, fake_user, two_test_notebooks):
    resp = client.get(reverse('user', kwargs={'name': fake_user.username}))
    assert resp.status_code == 200
    print(Notebook.objects.count())
    assert set(_get_page_data(str(resp.content)).keys()) == set(
        ['userInfo', 'notebookList', 'thisUser'])
