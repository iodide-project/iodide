import json
import tempfile

from django.urls import reverse

from server.files.models import File
from helpers import get_rest_framework_time_string


def test_post_to_file_api(fake_user, client, test_notebook):
    client.force_authenticate(user=fake_user)
    with tempfile.NamedTemporaryFile(mode='w+') as f:
        f.write('hello')
        resp = client.post(reverse('files-list'), {
            'metadata': json.dumps({
                'filename': 'my cool file.csv',
                'notebook_id': test_notebook.id
            }),
            'file': open(f.name)
        })
        assert resp.status_code == 201
        assert File.objects.count() == 1
        created_file = File.objects.get(id=1)
        assert created_file.content == 'hello'
        assert resp.json() == {
            'id': created_file.id,
            'last_updated': get_rest_framework_time_string(created_file.last_updated),
            'filename': 'my cool file.csv',
            'notebook_id': test_notebook.id
        }
