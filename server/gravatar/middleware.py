import hashlib


class GravatarMiddleware(object):
    """
    Simple middleware to set the user's avatar url to a gravatar (if not
    already set)
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        if user.is_authenticated and not user.avatar:
            user.avatar = "https://www.gravatar.com/avatar/{}?d=identicon".format(
                hashlib.md5(user.email.encode("utf-8")).hexdigest()
            )
            user.save()
        return self.get_response(request)
