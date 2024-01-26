from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class HealthCheck(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(status=status.HTTP_200_OK, data={'status': '200'})
