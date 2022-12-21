from django.urls import path
from components import views


urlpatterns = [
    path('', views.index, name='components'),
    path('search/', views.search_results, name='components_search_results'),
    path('lookup/', views.get_components, name="get_components")
]
