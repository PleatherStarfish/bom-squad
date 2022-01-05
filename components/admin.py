from django.contrib import admin
from components.models import Component, ComponentSupplier, ComponentManufacturer, Types
from import_export.admin import ImportExportModelAdmin

class ComponentAdmin(ImportExportModelAdmin):
    model = Component

class ComponentManufacturerAdmin(ImportExportModelAdmin):
    model = ComponentManufacturer


# Register your models here.
admin.site.register(Component, ComponentAdmin)
admin.site.register(Types)
admin.site.register(ComponentSupplier)
admin.site.register(ComponentManufacturer, ComponentManufacturerAdmin)