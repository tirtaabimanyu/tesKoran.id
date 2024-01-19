from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email)
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username, email, password)

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, unique=True,
                          default=uuid4, editable=False)
    username = models.CharField(
        max_length=16, unique=True, null=True, blank=True)
    email = models.EmailField(
        max_length=100, unique=True, null=False, blank=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    can_change_username = models.BooleanField(default=False)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    objects = CustomUserManager()

    class Meta:
        verbose_name = "User"
