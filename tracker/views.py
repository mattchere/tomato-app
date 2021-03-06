from tracker.models import Countdown, Tomato
from tracker.serializers import CountdownSerializer, TomatoSerializer, UserSerializer
from tracker.permissions import IsUser, IsUserAccount
from tracker.forms import SignUpForm
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework import permissions, viewsets, mixins
from rest_framework.response import Response


def index(request):
    if request.user.is_authenticated:
        return redirect(reverse('timer'))
    return render(request, 'index.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', { 'form': form })

@login_required
def timer(request):
    return render(request, 'tracker/timer.html')

@login_required
def countdown(request):
    return render(request, 'tracker/countdown.html')

@login_required
def profile(request):
    return render(request, 'tracker/profile.html')

class CountdownViewSet(viewsets.ModelViewSet):
    """
    Allows for `list`, `create`, `retrieve`, `update`,
    and `destroy` actions for Countdowns.
    """
    queryset = Countdown.objects.all()
    serializer_class = CountdownSerializer
    permission_classes = (permissions.IsAuthenticated,
                          IsUser)

    def get_queryset(self):
        return self.queryset.filter(user__exact=self.request.user) \
                            .order_by('due')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TomatoViewSet(viewsets.ModelViewSet):
    """
    Allows for `list`, `create`, `retrieve`, `update`,
    and `destroy` actions for Tomatoes.
    """
    queryset = Tomato.objects.all()
    serializer_class = TomatoSerializer
    permission_classes = (permissions.IsAuthenticated,
                          IsUser)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Tomato.objects.filter(user__exact=self.request.user)


class UserViewSet(mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    """
    Allows for the `retrieve` action for users.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,
                          IsUserAccount)
