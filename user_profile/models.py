from django.db import models
from django.utils import timezone
from django.template.defaultfilters import slugify
from modules.models import Module, Component, ModuleBomListItem
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE)
    built_modules = models.ManyToManyField(Module, blank=True, related_name='built')
    want_to_build_modules = models.ManyToManyField(Module, blank=True, related_name='want_to_build')
    component_inventory = models.ManyToManyField(Component, blank=True, related_name='user_component_inventory',
                                                 through='UserProfileComponentInventoryData')
    shopping_list = models.ManyToManyField(Component, blank=True, related_name='user_shopping_list',
                                                 through='UserProfileShoppingListData')
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.user}")
            super(UserProfile, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user}"

    class Meta:
        verbose_name_plural = "User Extended Properties"

class UserProfileComponentInventoryData(models.Model):
    component = models.ForeignKey(Component, null=True, on_delete=models.SET_NULL)
    profile = models.ForeignKey(UserProfile, null=True, on_delete=models.SET_NULL)
    number = models.PositiveIntegerField(default=0, blank=False)
    location = models.JSONField(blank=True)

    class Meta:
        verbose_name_plural = "User Component Inventory"

    def __str__(self):
        return f'[ {self.profile} ] - {self.component}'

# Allows users to add modules to a named list
# All modules are also in a default "all" list which is just
class UserShoppingLists(models.Model):
    name = models.CharField(max_length=255, blank=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "User-Defined, Named Shopping Lists"

    def __str__(self):
        return f'[ {self.user} ] - {self.name}'

class UserProfileShoppingListData(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    bom_item = models.ForeignKey(ModuleBomListItem, on_delete=models.CASCADE)
    component = models.ForeignKey(Component, on_delete=models.CASCADE)
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    number = models.PositiveIntegerField(default=0, blank=False)
    tags = models.JSONField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "User Shopping List"

    def __str__(self):
        return f'[ {self.profile} ] - {self.component}'