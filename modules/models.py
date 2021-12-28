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
# in the BOM. So we use this table to handle these slots and associate them with the actual
# component that might work for that BOM in the real world
class ModuleComponentIdentity(models.Model):
    name = models.CharField(max_length=255)
    bom_order = models.IntegerField(blank=False, null=False, unique=True)
    component = models.ManyToManyField(Component, blank=False, related_name='component_identity_to_component')
    module = models.ForeignKey('Module', on_delete=models.PROTECT)

    class Meta:
        verbose_name_plural = "Module Component Identities"
        unique_together = ('module', 'bom_order')


# Create your models here.
class Module(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.PROTECT)
    version = models.CharField(max_length=10, default="1")
    description = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)
    image = models.ImageField(blank=True)
    component_identities = models.ManyToManyField(ModuleComponentIdentity, blank=True, related_name='module_component_to_identity')
    slug = models.SlugField(blank=True)

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