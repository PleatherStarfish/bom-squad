from django.contrib import admin
from user_profile.models import UserProfile, UserProfileComponentInventoryData, UserProfileShoppingListData
from import_export.admin import ImportExportModelAdmin

class UserProfileComponentInventoryDataAdmin(ImportExportModelAdmin):
    model = UserProfileComponentInventoryData

class UserProfileShoppingListDataAdmin(ImportExportModelAdmin):
    model = UserProfileShoppingListData

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(UserProfileComponentInventoryData, UserProfileComponentInventoryDataAdmin)
admin.site.register(UserProfileShoppingListData, UserProfileShoppingListDataAdmin)
