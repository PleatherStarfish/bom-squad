from django.urls import path
from components import views
from .views import index


urlpatterns = [
    path('', views.index, name='components'),
]
