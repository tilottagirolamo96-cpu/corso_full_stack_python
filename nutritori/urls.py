from django.urls import path
from . import views


urlpatterns=[
    path('tabelle/', views.tabelle_alimenti_view, name='tabelle_alimenti'),
]