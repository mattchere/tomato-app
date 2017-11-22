from datetime import timedelta
from django.db import models
from django.utils import timezone

class Countdown(models.Model):
    title = models.CharField(max_length=50)
    due = models.DateField()
    user = models.ForeignKey('auth.User', related_name='countdowns', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Tomato(models.Model):
    task = models.CharField(max_length=50, blank=True)
    duration = models.DurationField(default=timedelta(minutes=25))
    completed = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('auth.User', related_name='tomatoes', on_delete=models.CASCADE)

    def __str__(self):
        return self.task
