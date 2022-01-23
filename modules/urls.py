from django.urls import path
from modules import views
from django.views.generic import RedirectView

app_name = 'modules'

urlpatterns = [
    path('', RedirectView.as_view(url='/')),
    path('<slug:slug>/<int:id>', views.add_to_shopping_list, name='AddToShoppingList'),
    path('<slug:slug>/', views.module_detail, name='ModuleDetail'),
]
