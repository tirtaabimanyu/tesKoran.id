from django.db import models
from authentication.models import CustomUser


class TEST_TYPES(models.TextChoices):
    PAULI = ("pauli", "Pauli")
    KRAEPELIN = ("kraepelin", "Kraepelin")


class TestScore(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=False, blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    is_ranked = models.BooleanField(null=False, blank=False)
    addition_per_minute = models.FloatField(null=False, blank=False)
    accuracy = models.FloatField(null=False, blank=False)
    correct_answer = models.IntegerField(null=False, blank=False)
    modified_answer = models.IntegerField(null=False, blank=False)
    incorrect_answer = models.IntegerField(null=False, blank=False)
    test_type = models.CharField(
        choices=TEST_TYPES.choices, max_length=16, null=False, blank=False
    )
    duration = models.IntegerField(
        help_text="Duration in seconds", null=False, blank=False
    )
