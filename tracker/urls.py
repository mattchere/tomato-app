from django.conf.urls import url, include
from tracker import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'countdowns', views.CountdownViewSet)
router.register(r'tomatoes', views.TomatoViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^tracker/$', views.tracker, name='tracker'),
    url(r'^countdown/$', views.countdown, name='countdown'),
    url(r'^profile/$', views.profile, name='profile'),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api_auth/', include('rest_framework.urls', namespace='rest_framework')),
]
