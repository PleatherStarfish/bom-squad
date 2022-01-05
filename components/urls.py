from django.urls import path
from home import views
from .views import index


urlpatterns = [
    path('', views.index, name='components'),
]
