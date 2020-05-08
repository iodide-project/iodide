import json

import pytest
from django.urls import reverse


@pytest.mark.parametrize("logged_in", [True, False])
def test_new_notebook_view(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)

    resp = client.get(reverse("userinfo"))
    assert resp.status_code == 200
    expected_content = (
        {
            "avatar": "https://www.gravatar.com/avatar/eaee5961bc7ad96538a4933cb069fda9"
            + "?d=identicon",
            "name": "testuser1",
        }
        if logged_in
        else {}
    )
    assert json.loads(resp.content) == expected_content
