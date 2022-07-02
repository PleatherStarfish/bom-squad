from django.urls import path
from . import views

urlpatterns = [
    path('add_components/', views.addComponentsToShoppingList, name="add-components"),
    path('<slug:slug>/', views.user_page, name='user_page'),
]