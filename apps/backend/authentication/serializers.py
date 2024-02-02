import re
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from djoser.serializers import UserSerializer, UserCreatePasswordRetypeSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


def username_validator(value):
    errors = []
    if len(value) < 4 or len(value) > 16:
        errors.append("Username length must be between 4 and 16")
    if not re.match("^[a-zA-Z0-9_]*$", value):
        errors.append(
            "Username must only include lowercase, uppercase, number, and underscore"
        )
    if errors:
        raise serializers.ValidationError(errors)


class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "can_change_username"]
        required_fields = fields
        extra_kwargs = {
            "username": {
                "validators": [
                    username_validator,
                    UniqueValidator(queryset=User.objects.all(), lookup="iexact"),
                ]
            }
        }

    def validate_can_change_username(self, value):
        if not self.instance.can_change_username:
            raise serializers.ValidationError("User can not change username")
        return value


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ["username", "email", "is_active", "can_change_username", "created_on"]


class CustomUserCreatePasswordRetypeSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        extra_kwargs = {
            "username": {
                "validators": [
                    username_validator,
                    UniqueValidator(queryset=User.objects.all(), lookup="iexact"),
                ]
            }
        }


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username

        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = RefreshToken(attrs["refresh"])
        user = User.objects.get(email=refresh["email"])
        refresh["username"] = user.username

        data = {"access": str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    refresh.blacklist()
                except AttributeError:
                    pass

            refresh.set_jti()
            refresh.set_exp()

            data["refresh"] = str(refresh)

        return data
