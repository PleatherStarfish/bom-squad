from django.db import models
from django.utils import timezone
from django.template.defaultfilters import slugify
from components.models import Component
from django.core.files.storage import FileSystemStorage


class Manufacturer(models.Model):
    name = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    date_updated = models.DateField(default=timezone.now, blank=False)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}")
            super(Manufacturer, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"

# Each modules has a lit of ModuleComponentIdentities (which are the part "slots" in the BOM)
# However, in the real world, more than one part can sometimes work for a requested component
# in the BOM. So we use this table to handle these slots and associate them with a list of actual
# component that might work for that BOM part in the real world
class ModuleBomListItem(models.Model):
    name = models.CharField(max_length=255, blank=False)
    component = models.ManyToManyField(Component, blank=False, related_name='component_identity_to_component')
    module = models.ForeignKey('Module', blank=False, null=False, on_delete=models.PROTECT)
    designators = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.IntegerField(blank=False, null=False)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Module BOM List Items"
        unique_together = ('name', 'module')

    def __str__(self):
        return f"{self.module.name} ({self.name})"


# Create your models here.
class Module(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.PROTECT)
    version = models.CharField(max_length=10, default="1")
    description = models.TextField()
    image = models.ImageField(blank=True)
    manufacturer_page_link = models.URLField(blank=True)
    bom_link = models.URLField(blank=True)
    manual_link = models.URLField(blank=True)
    modulargrid_link = models.URLField(blank=True)
    component_identities = models.ManyToManyField(ModuleBomListItem, blank=True, related_name='module_component_to_identity')
    slug = models.SlugField(blank=True)
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Modules"
        unique_together = ('name', 'manufacturer', 'version')

    def save(self, *args, **kwargs):
        if self.description:
            self.description = self.description
            super(Module, self).save(*args, **kwargs)
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.manufacturer}-{self.version}")
            super(Module, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.manufacturer}"