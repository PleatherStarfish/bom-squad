from django.db import models

class Manufacturer(models.Model):
    name = models.CharField(max_length=255)
    notes = models.TextField()

# Create your models here.
class Module(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.PROTECT)
    version = models.CharField(max_length=10, default="1")
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('name', 'manufacturer', 'version')