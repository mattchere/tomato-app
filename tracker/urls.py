from django.conf.urls import url, include
from tracker import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'countdowns', views.CountdownViewSet)
router.register(r'tomatoes', views.TomatoViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api_auth/', include('rest_framework.urls', namespace='rest_framework')),
]
