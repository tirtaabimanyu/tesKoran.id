from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, UsernameSerializer


class GetUserProfile(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class CheckUsername(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.GET.get('username', None)
        if not username:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user and username:
            initial_username = request.user.username
            if initial_username == username:
                return Response(status=status.HTTP_200_OK)

        serializer = UsernameSerializer(data={
            'username': username
        }, partial=True)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_200_OK)


class ChangeUsername(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'username' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = UsernameSerializer(request.user, data={
            'username': request.data['username'],
            'can_change_username': False
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_202_ACCEPTED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
