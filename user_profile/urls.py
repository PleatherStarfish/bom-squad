from django.urls import path
from . import views

urlpatterns = [
    path('add_components_to_shopping/', views.addComponentsToShoppingList, name="add-shopping"),
    path('add_components_to_inventory/', views.addComponentsToComponentInventoryList, name="add-inventory"),
    path('inventory_data/csv/', views.export_inventory_data_csv, name='export_inventory_data_csv'),
    path('update_inventory/', views.update_inventory, name='update_inventory'),
    path('<slug:slug>/', views.user_page, name='user_page'),
]