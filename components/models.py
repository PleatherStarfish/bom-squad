from django.db import models
from suppliers.models import Supplier

# Create your models here.
class Types(models.Model):
    name = models.CharField(max_length=255)
    notes = models.TextField()

class Component(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(Types, on_delete=models.PROTECT)
    notes = models.TextField()
