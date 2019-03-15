from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.URLField(null=True)
    can_create_on_behalf_of_others = models.BooleanField(default=False)
