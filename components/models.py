from django.db import models
from suppliers.models import Supplier
from django.utils import timezone

# Create your models here.
class Types(models.Model):
    name = models.CharField(max_length=255)
    notes = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Types"

class ComponentSupplier(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=255)

    class Meta:
        verbose_name_plural = "Component Supplier"

    def __str__(self):
        return self.name

class ComponentManufacturer(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Component Manufacturers"

    def __str__(self):
        return self.name

class Component(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ManyToManyField(ComponentManufacturer, blank=True)
    supplier = models.ManyToManyField(ComponentSupplier, blank=True)
    type = models.ForeignKey(Types, on_delete=models.PROTECT)
    notes = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Components"
        unique_together = ('name', 'type')

    def __str__(self):
        return self.name
