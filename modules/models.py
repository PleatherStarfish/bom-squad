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
        verbose_name_plural = "Modules"
        unique_together = ('name', 'manufacturer', 'version')

    def __str__(self):
        return f"{self.name} - {self.manufacturer}"