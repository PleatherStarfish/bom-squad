from django.db import models

# Create your models here.
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = "Suppliers"

    def __str__(self):
        return self.name