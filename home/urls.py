from django.urls import path
from home import views
from .views import search_results

urlpatterns = [
    path('search/', views.search_results, name='search_results'),
    path('', views.index, name='home'),
]
