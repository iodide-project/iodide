import requests
from social_django.models import UserSocialAuth


class GithubAuthMiddleware(object):
    '''
    Simple middleware to get the user's avatar url from github (if not already
    set)
    '''

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and not request.user.avatar:
            try:
                user_social_auth = UserSocialAuth.objects.get(user=request.user)
                social_auth_extra_data = user_social_auth.extra_data
                github_info = requests.get(
                    'https://api.github.com/users/%s' %
                    social_auth_extra_data['login']).json()
                avatar_url = github_info.get('avatar_url')
                if avatar_url:
                    request.user.avatar = avatar_url
                    request.user.save()
            except UserSocialAuth.DoesNotExist:
                # not using github, I guess
                pass

        return self.get_response(request)
