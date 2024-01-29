from django.urls import path
from scores.views import BaseView, ListTopScores

urlpatterns = [
    path("", BaseView.as_view()),
    path("leaderboard/<int:duration>/", ListTopScores.as_view()),
]
