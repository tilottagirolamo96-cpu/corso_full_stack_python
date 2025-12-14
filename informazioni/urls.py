from django.urls import path
from . import views


urlpatterns =[
    path('alimentazione_sana/', views.alimentazione_sana, name='alimentazione_sana'),
    path('diete/', views.diete, name='diete'),
]