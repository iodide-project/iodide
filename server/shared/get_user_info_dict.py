from social_django.models import UserSocialAuth


def get_user_info_dict(user):
    if user.is_authenticated:
        user_social_auth = UserSocialAuth.objects.get(user=user)
        social_auth_extra_data = user_social_auth.extra_data
        return {
            'name': social_auth_extra_data['login'],
            'avatar': user.avatar,
            'accessToken': user.social_auth_extra_data['access_token']
        }
    return {}
