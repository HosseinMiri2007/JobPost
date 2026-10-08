from django.urls import path
from . import views


urlpatterns = [
    path('register/',views.register),
    path('me/',views.me),
    path('me/update/',views.updateUser),
    path('upload/resume/',views.uploadResume)
]