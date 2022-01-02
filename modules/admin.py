from django.contrib import admin
from .models import Manufacturer, Module, ModuleBomListItem

# Register your models here.
admin.site.register(Manufacturer)
admin.site.register(Module)
admin.site.register(ModuleBomListItem)