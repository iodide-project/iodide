from django.urls import reverse


def test_read_server_file(client, test_file):
    resp = client.get(
        reverse('file-view', kwargs={
            'notebook_pk': test_file.notebook.id,
            'filename': test_file.filename
        })
    )
    assert resp.status_code == 200
    assert [k for k in resp.streaming_content][0] == test_file.content
