from django.contrib import admin
from .models import Manufacturer, Module

# Register your models here.
admin.site.register(Manufacturer)
admin.site.register(Module)