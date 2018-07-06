import requests
from social_django.models import UserSocialAuth


def get_github_identity_data(user):
    # small helper method to help get github data for client-side api access
    # and identifying the user (user id / avatar)
    user_social_auth = UserSocialAuth.objects.get(user=user)
    social_auth_extra_data = user_social_auth.extra_data
    github_info = requests.get('https://api.github.com/users/%s' %
                               social_auth_extra_data['login']).json()
    return {
        'name': social_auth_extra_data['login'],
        'avatar': github_info['avatar_url'],
        'accessToken': social_auth_extra_data['access_token']
    }
