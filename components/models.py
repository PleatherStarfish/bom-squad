from django.db import models
from suppliers.models import Supplier
from django.utils import timezone

# Create your models here.
class Types(models.Model):
    name = models.CharField(max_length=255)
    notes = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)

class Component(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(Types, on_delete=models.PROTECT)
    notes = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Components"

    def __str__(self):
        return self.name
