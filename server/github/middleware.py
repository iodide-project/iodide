import logging

import requests
from social_django.models import UserSocialAuth

logger = logging.getLogger(__name__)


class GithubAuthMiddleware(object):
    '''
    Simple middleware to get the user's avatar url from github (if not already
    set)
    '''

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            try:
                user_social_auth = UserSocialAuth.objects.get(user=request.user)
                social_auth_extra_data = user_social_auth.extra_data
                request.user.social_auth_extra_data = social_auth_extra_data
                if not request.user.avatar:
                    try:
                        r = requests.get(
                            'https://api.github.com/users/%s' %
                            social_auth_extra_data['login'])
                        r.raise_for_status()
                        github_info = r.json()
                        avatar_url = github_info.get('avatar_url')
                        if avatar_url:
                            request.user.avatar = avatar_url
                            request.user.save()
                    except requests.exceptions.HTTPError as err:
                        # was unable to get user info from github, we can just
                        # return a blank avatar for this case
                        logger.error('Error getting information for user %s from github: %s',
                                     request.user.username, err)
            except UserSocialAuth.DoesNotExist:
                # not using github, I guess
                pass

        return self.get_response(request)
