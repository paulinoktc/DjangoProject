from django.urls import path 
from . import views

urlpatterns = [
   # path('',views.hello),
    path('about/',views.about),
    path('',views.clientes),
    path('details/<int:id>',views.cliente_details)
]