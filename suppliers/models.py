from django.db import models
from django.utils import timezone

# Create your models here.
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=255, unique=True)
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Suppliers"

    def __str__(self):
        return self.name