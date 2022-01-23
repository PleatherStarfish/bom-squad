from django.contrib import admin
from user_profile.models import UserProfile, UserProfileComponentInventoryData, UserProfileShoppingListData, UserShoppingLists
from import_export.admin import ImportExportModelAdmin

class UserProfileAdmin(ImportExportModelAdmin):
    model = UserProfile

class UserShoppingListsAdmin(ImportExportModelAdmin):
    model = UserShoppingLists

class UserProfileComponentInventoryDataAdmin(ImportExportModelAdmin):
    model = UserProfileComponentInventoryData

class UserProfileShoppingListDataAdmin(ImportExportModelAdmin):
    model = UserProfileShoppingListData

# Register your models here.
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserShoppingLists, UserShoppingListsAdmin)
admin.site.register(UserProfileComponentInventoryData, UserProfileComponentInventoryDataAdmin)
admin.site.register(UserProfileShoppingListData, UserProfileShoppingListDataAdmin)
