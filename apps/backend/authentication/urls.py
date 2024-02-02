from django.urls import include, path
from rest_framework.routers import DefaultRouter

from authentication.views import (
    CustomUserViewset,
    GetUserProfile,
    CheckUsername,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    ChangeUsername,
)

router = DefaultRouter()
router.register("users", CustomUserViewset)

urlpatterns = [
    path("users/profile/", GetUserProfile.as_view()),
    path("users/check-username/", CheckUsername.as_view()),
    path("users/change-username/", ChangeUsername.as_view()),
    path("jwt/create/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("jwt/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("", include("djoser.social.urls")),
    path("", include(router.urls)),
]
