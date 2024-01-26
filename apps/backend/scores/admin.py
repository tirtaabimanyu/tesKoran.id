from django.contrib import admin
from .models import TestScore

# Register your models here.


class TestScoreAdmin(admin.ModelAdmin):
    model = TestScore


admin.site.register(TestScore, TestScoreAdmin)
