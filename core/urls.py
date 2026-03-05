from django.urls import path, include
from rest_framewor.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls))
]

