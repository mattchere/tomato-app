from tracker.models import Countdown, Tomato
from django.contrib.auth.models import User
from rest_framework import serializers


class CountdownSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(view_name='user-detail', read_only=True)

    class Meta:
        model = Countdown
        fields = ('url', 'id', 'title', 'due', 'user',)


class TomatoSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(view_name='user-detail', read_only=True)

    class Meta:
        model = Tomato
        fields = ('url', 'id', 'task', 'duration', 'completed', 'user')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    countdowns = serializers.HyperlinkedRelatedField(many=True, view_name='countdown-detail', read_only=True)
    tomatoes = serializers.HyperlinkedRelatedField(many=True, view_name='tomato-detail', read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'countdowns', 'tomatoes',)
