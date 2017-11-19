from tracker.models import Countdown, Tomato
from tracker.serializers import CountdownSerializer, TomatoSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework import permissions, viewsets

class CountdownViewSet(viewsets.ModelViewSet):
    """
    Allows for `list`, `create`, `retrieve`, `update`,
    and `destroy` actions for Countdowns.
    """
    queryset = Countdown.objects.all().order_by('due')
    serializer_class = CountdownSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TomatoViewSet(viewsets.ModelViewSet):
    """
    Allows for `list`, `create`, `retrieve`, `update`,
    and `destroy` actions for Tomatoes.
    """
    queryset = Tomato.objects.all()
    serializer_class = TomatoSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Allows for `list` and `detail` actions for users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
