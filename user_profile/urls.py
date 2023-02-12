from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.me, name='me'),
    path('add_components_to_shopping/', views.addComponentsToShoppingList, name="add-shopping"),
    path('add_components_to_inventory/', views.addComponentsToComponentInventoryList, name="add-inventory"),
    path('inventory_data/csv/', views.export_inventory_data_csv, name='export_inventory_data_csv'),
    path('update_inventory/', views.update_inventory, name='update_inventory'),
    path('update_inventory_quantity/<int:pk>', views.update_inventory_quantity, name='update_inventory_quantity'),
    path('update_inventory_location/<int:pk>', views.update_inventory_location, name='update_inventory_location'),
    path('delete_inventory_item/<int:pk>', views.delete_inventory_item, name='delete_inventory_item'),
    path('user_inventory/', views.user_inventory, name='user_inventory'),
    path('<slug:slug>/', views.user_page, name='user_page'),
]