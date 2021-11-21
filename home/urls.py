from django.urls import path
from home import views
from .views import search_results

urlpatterns = [
    path('', views.index, name='home'),
    path('search/', views.search_results, name='search_results'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register_user, name='register')
]
