from rest_framework import status, serializers, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import TestScore


class BaseView(generics.GenericAPIView):
    def post(self, request) -> Response:
        return CreateScore.as_view()(request._request)


class CreateScore(generics.GenericAPIView):
    class InputSerializer(serializers.Serializer):
        is_ranked = serializers.BooleanField()
        addition_per_minute = serializers.FloatField()
        accuracy = serializers.FloatField()
        correct_answer = serializers.IntegerField()
        modified_answer = serializers.IntegerField()
        incorrect_answer = serializers.IntegerField()
        test_type = serializers.CharField()
        duration = serializers.CharField()

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        TestScore.objects.create(user=request.user, **serializer.data)

        return Response(status=status.HTTP_202_ACCEPTED)


class ListTopScores(generics.GenericAPIView):
    class OutputSerializer(serializers.Serializer):
        username = serializers.CharField(source="user.username")
        created_at = serializers.DateTimeField()
        addition_per_minute = serializers.FloatField()
        accuracy = serializers.FloatField()

    permission_classes = [AllowAny]

    def get(self, request, duration):
        test_score_ids = (
            TestScore.objects.filter(is_ranked=True, duration=duration)
            .order_by("user__id", "-addition_per_minute", "-accuracy")
            .distinct("user__id")
        )
        queryset = TestScore.objects.filter(id__in=test_score_ids).order_by(
            "-addition_per_minute", "-accuracy"
        )
        data = self.paginate_queryset(queryset=queryset)

        serializer = self.OutputSerializer(data, many=True)
        return self.get_paginated_response(serializer.data)
