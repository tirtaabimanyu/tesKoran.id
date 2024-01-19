from django.urls import include, path
from authentication.views import GetUserProfile, CheckUsername, CustomTokenObtainPairView, CustomTokenRefreshView, ChangeUsername

urlpatterns = [
    path('users/profile/', GetUserProfile.as_view()),
    path('users/check-username/', CheckUsername.as_view()),
    path('users/change-username/', ChangeUsername.as_view()),
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('', include('djoser.urls')),
    path('', include('djoser.social.urls')),
]
