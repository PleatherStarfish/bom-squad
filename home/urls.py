from django.urls import path
from home import views
from .views import search_results
from django.conf import settings
from django.conf.urls.static import static

app_name = "home"

urlpatterns = [
    path('', views.splash, name='splash'),
    path('modules/', views.index, name='home'),
    path('search/', views.search_results, name='search_results'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register_user, name='register'),
    path('add_to_built/<int:id>', views.add_to_built, name='AddToBuilt'),
    path('remove_from_built/<int:id>', views.remove_from_built, name='RemoveFromBuilt')
]
