from django.db import models
from django.utils import timezone
from django.template.defaultfilters import slugify
from modules.models import Module
from django.contrib.auth.models import User


class UserExtended(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    built_modules = models.ForeignKey(Module, null=True, blank=True, on_delete=models.SET_NULL, related_name='built_modules')
    want_to_build_modules = models.ForeignKey(Module, null=True, blank=True, on_delete=models.SET_NULL, related_name='want_to_build_modules')
    component_inventory = models.JSONField(blank=True, null=True)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.first_name}_{self.last_name}")
            super(UserExtended, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name}_{self.last_name}"
