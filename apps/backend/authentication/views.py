from django.core.cache import cache
from django.db.models import Sum
from djoser.compat import get_user_email
from djoser.conf import settings
from djoser.views import UserViewSet as DjoserUserViewSet

from rest_framework import views, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from scores.models import TestScore
from .serializers import (
    CustomUserSerializer,
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
    UsernameSerializer,
)


class GetUserProfile(views.APIView):
    permission_classes = [IsAuthenticated]

    class OutputSerializer(serializers.Serializer):
        class HistorySerializer(serializers.Serializer):
            class HistoryTypeSerializer(serializers.Serializer):
                apm = serializers.FloatField(source="addition_per_minute")
                accuracy = serializers.FloatField()
                created_at = serializers.DateTimeField()

            ranked = HistoryTypeSerializer(many=True)
            mixed = HistoryTypeSerializer(many=True)

        class LeaderboardSerializer(serializers.Serializer):
            class LeaderboardTypeSerializer(serializers.Serializer):
                class TestSerializer(serializers.Serializer):
                    username = serializers.CharField(source="user.username")
                    created_at = serializers.DateTimeField()
                    addition_per_minute = serializers.FloatField()
                    accuracy = serializers.FloatField()

                THIRTY_SECOND = TestSerializer(many=True)
                THREE_MINUTE = TestSerializer(many=True)
                TWENTY_MINUTE = TestSerializer(many=True)
                ONE_HOUR = TestSerializer(many=True)

            ranked = LeaderboardTypeSerializer()
            mixed = LeaderboardTypeSerializer()

        user = CustomUserSerializer()
        total_test = serializers.IntegerField()
        total_time = serializers.IntegerField()
        average_apm = serializers.FloatField()
        average_accuracy = serializers.FloatField()
        history = HistorySerializer()
        leaderboard = LeaderboardSerializer()

    def get(self, request):
        queryset = TestScore.objects.filter(user=request.user)
        ranked_queryset = queryset.filter(is_ranked=True)

        total_test = len(queryset)
        total_time = queryset.aggregate(Sum("duration"))["duration__sum"] or 0
        total_apm = (
            queryset.aggregate(Sum("addition_per_minute"))["addition_per_minute__sum"]
            or 0
        )
        total_accuracy = queryset.aggregate(Sum("accuracy"))["accuracy__sum"] or 0
        average_apm = total_apm / total_test if total_test > 0 else 0
        average_accuracy = total_accuracy / total_test if total_test > 0 else 0

        ranked_history = list(ranked_queryset.order_by("created_at"))[-10:]
        mixed_history = list(queryset.order_by("created_at"))[-10:]
        ranked_leaderboard = {
            "THIRTY_SECOND": ranked_queryset.filter(duration=30).order_by(
                "-addition_per_minute"
            )[:10],
            "THREE_MINUTE": ranked_queryset.filter(duration=180).order_by(
                "-addition_per_minute"
            )[:10],
            "TWENTY_MINUTE": ranked_queryset.filter(duration=1200).order_by(
                "-addition_per_minute"
            )[:10],
            "ONE_HOUR": ranked_queryset.filter(duration=3600).order_by(
                "-addition_per_minute"
            )[:10],
        }
        mixed_leaderboard = {
            "THIRTY_SECOND": queryset.filter(duration=30).order_by(
                "-addition_per_minute"
            )[:10],
            "THREE_MINUTE": queryset.filter(duration=180).order_by(
                "-addition_per_minute"
            )[:10],
            "TWENTY_MINUTE": queryset.filter(duration=1200).order_by(
                "-addition_per_minute"
            )[:10],
            "ONE_HOUR": queryset.filter(duration=3600).order_by("-addition_per_minute")[
                :10
            ],
        }

        serializer = self.OutputSerializer(
            {
                "user": request.user,
                "total_test": total_test,
                "total_time": total_time,
                "average_apm": average_apm,
                "average_accuracy": average_accuracy,
                "history": {
                    "ranked": ranked_history,
                    "mixed": mixed_history,
                },
                "leaderboard": {
                    "ranked": ranked_leaderboard,
                    "mixed": mixed_leaderboard,
                },
            }
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class CheckUsername(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.GET.get("username", None)
        if not username:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user and username:
            initial_username = request.user.username
            if initial_username == username:
                return Response(status=status.HTTP_200_OK)

        serializer = UsernameSerializer(data={"username": username}, partial=True)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_200_OK)


class ChangeUsername(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "username" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = UsernameSerializer(
            request.user,
            data={"username": request.data["username"], "can_change_username": False},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_202_ACCEPTED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


class CustomUserViewset(DjoserUserViewSet):
    @action(["post"], detail=False)
    def resend_activation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user(is_active=False)

        if not settings.SEND_ACTIVATION_EMAIL or not user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # check if user has already sent an email in the last 10 min
        user_email = get_user_email(user)
        cache_key = f"activation/{user_email}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        context = {"user": user}
        settings.EMAIL.activation(self.request, context).send([user_email])
        cache.set(cache_key, True, timeout=settings.SEND_ACTIVATION_EMAIL_TIMER)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["post"], detail=False)
    def reset_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user()

        if user:
            # check if user has already sent an email in the last 10 min
            user_email = get_user_email(user)
            cache_key = f"reset-password/{user_email}"
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            context = {"user": user}
            settings.EMAIL.password_reset(self.request, context).send([user_email])
            cache.set(cache_key, True, timeout=settings.SEND_RESET_PASSWORD_EMAIL_TIMER)

        return Response(status=status.HTTP_204_NO_CONTENT)
