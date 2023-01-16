from django.urls import path
from home import views
from .views import search_results
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.index, name='home'),
    path('search/', views.search_results, name='search_results'),
    path('add_to_built/<int:id>', views.add_to_built, name='AddToBuilt'),
    path('remove_from_built/<int:id>', views.remove_from_built, name='RemoveFromBuilt'),
    path('add_to_to_build/<int:id>', views.add_to_to_build, name='AddToToBuild'),
    path('remove_from_to_build/<int:id>', views.remove_from_to_build, name='RemoveFromToBuild')
]
