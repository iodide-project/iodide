from django.conf import settings
from django.template.loader import render_to_string


def google_analytics(request):
    """
    Returns analytics code.
    """
    if settings.GA_TRACKING_ID:
        return {
            "google_analytics": render_to_string(
                "ga.html", {"GA_TRACKING_ID": settings.GA_TRACKING_ID}
            )
        }
    else:
        return {"google_analytics": ""}


def site_url(request):
    """
    Returns site URL.
    """
    return {"SITE_URL": settings.SITE_URL}
