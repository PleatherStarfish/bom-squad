from django.urls import path
from . import views

urlpatterns = [
    path('add_components_to_shopping/', views.addComponentsToShoppingList, name="add-shopping"),
    path('add_components_to_inventory/', views.addComponentsToComponentInventoryList, name="add-inventory"),
    path('<slug:slug>/', views.user_page, name='user_page'),
]