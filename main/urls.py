from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home_view'),
    path('createRooms/', views.create_rooms, name='create_rooms'),
    path('simpleCall/', views.simple_call, name='simple_call'),
]
