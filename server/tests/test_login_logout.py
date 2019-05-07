import pytest
from django.contrib import auth
from django.urls import reverse


@pytest.mark.parametrize("logged_in", [True, False])
def test_login(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)
    resp = client.get(reverse("login"), follow=True)
    if logged_in:
        assert resp.status_code == 200
        assert len(resp.redirect_chain) == 1
        (last_url, _) = resp.redirect_chain[-1]
        assert last_url == reverse("login_success")
    else:
        assert resp.status_code == 200
        assert len(resp.redirect_chain) == 1
        (last_url, _) = resp.redirect_chain[-1]
        assert last_url == reverse("index")


@pytest.mark.parametrize("logged_in", [True, False])
def test_logout(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)
    resp = client.get(reverse("logout"))
    # in neither case should the user be logged in after this endpoint
    # is accessed
    user = auth.get_user(client)
    assert not user.is_authenticated
