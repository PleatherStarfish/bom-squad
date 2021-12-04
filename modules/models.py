from django.db import models
from django.utils import timezone
from django.template.defaultfilters import slugify
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

# Create your models here.
class Module(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.PROTECT)
    version = models.CharField(max_length=10, default="1")
    description = models.TextField()
    date_updated = models.DateField(default=timezone.now, blank=False)
    image = models.ImageField(blank=True)
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