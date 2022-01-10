from django.contrib import admin
from .models import Manufacturer, Module, ModuleBomListItem
from import_export.admin import ImportExportModelAdmin

class ManufacturerAdmin(ImportExportModelAdmin):
    model = Manufacturer

class ModuleAdmin(ImportExportModelAdmin):
    model = Module

class ModuleBomListItemAdmin(ImportExportModelAdmin):
    model = ModuleBomListItem

# Register your models here.
admin.site.register(Manufacturer, ManufacturerAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(ModuleBomListItem, ModuleBomListItemAdmin)