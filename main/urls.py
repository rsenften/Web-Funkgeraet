from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home_view'),
    path('createRoom/', views.create_room, name='create_room'),
    path('createRooms/', views.create_rooms, name='create_rooms'),
    path('listRooms/', views.list_rooms, name='list_rooms'),
    path('saveRoom/', views.save_room, name='save_room'),
    path('simpleCall/', views.simple_call, name='simple_call'),
    path('complexCall/', views.complex_call, name='complex_call'),
    path('simulator/', views.simulator, name='simulator'),
    path('recaptchaDemo', views.recaptcha_demo, name='recaptcha_demo'),
]
