from django.urls import path
from . import views

urlpatterns = [
    path('<slug:slug>/', views.user_page, name='user_page'),
]