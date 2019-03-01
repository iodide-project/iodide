import io
import mimetypes

from django.http import FileResponse

from .models import File


def file_view(request, notebook_pk, filename):
    file = File.objects.values_list("content", flat=True).get(
        notebook_id=notebook_pk, filename=filename
    )
    return FileResponse(
        io.BytesIO(file), content_type=mimetypes.guess_type(filename)[0] or "text/plain"
    )
