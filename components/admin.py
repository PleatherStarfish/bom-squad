from django.contrib import admin
from components.models import Component, ComponentSupplier, ComponentManufacturer, Types

# Register your models here.
admin.site.register(Component)
admin.site.register(Types)
admin.site.register(ComponentSupplier)
admin.site.register(ComponentManufacturer)