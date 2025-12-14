from django.urls import path
from . import views

app_name='calcolatore'
urlpatterns =[
path('calcolo_alimenti/', views.calcolo_alimenti, name='calcolo_alimenti'),
path('fe/', views.tabella_view, name='fe'),
path('imc/',views.imc,name='imc')

]