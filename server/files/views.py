from django.http import HttpResponse

from .models import File


def file_view(request, notebook_pk, filename):
    return HttpResponse(
        File.objects.values_list('content', flat=True).get(
            notebook_id=notebook_pk, filename=filename).tobytes(),
        content_type='application/octet-stream'
    )
