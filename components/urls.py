from django.urls import path
from components import views


urlpatterns = [
    path('', views.index, name='components'),
    path('add_to_components_list/', views.add_to_components_list, name='add_to_components_list'),
    path('add_to_shopping_list/', views.add_to_shopping_list, name='add_to_shopping_list'),
    path('search/', views.search_results, name='components_search_results'),
]
