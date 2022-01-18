from django.db import models
from suppliers.models import Supplier
from django.utils import timezone
from django.core.exceptions import ValidationError

OHMS_UNITS = (
    ("Ω", "Ω"),
    ("kΩ", "kΩ"),
    ("MΩ", "MΩ"),
)

FARAD_UNITS = (
    ("mF", "mF"),
    ("μF", "μF"),
    ("nF", "nF"),
    ("pF", "pF"),
)

# Create your models here.
class Types(models.Model):
    name = models.CharField(max_length=255, unique=True)
    order = models.PositiveSmallIntegerField(unique=False)
    notes = models.TextField(blank=True)
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Types"
        ordering = ['order']

    def __str__(self):
        return f"{self.name}"

class ComponentSupplier(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=30)
    url = models.URLField(max_length=255)

    class Meta:
        verbose_name_plural = "Component Supplier"

    def __str__(self):
        return self.name

class ComponentManufacturer(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = "Component Manufacturers"

    def __str__(self):
        return self.name

class Component(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.ForeignKey(ComponentManufacturer, blank=True, on_delete=models.PROTECT)
    supplier = models.ManyToManyField(ComponentSupplier, blank=True)
    supplier_item_no = models.CharField(max_length=100, blank=False, unique=True)
    type = models.ForeignKey(Types, blank=False, on_delete=models.PROTECT)
    ohms = models.DecimalField(blank=True, null=True, decimal_places=1, max_digits=6, help_text="If the component type involves resistance, this value MUST be set.")
    ohms_unit = models.CharField(max_length=2, choices=OHMS_UNITS, blank=True, null=True, help_text="If the component type involves resistance, this value MUST be set.")
    farads = models.DecimalField(blank=True, null=True, decimal_places=1, max_digits=6, help_text="If the component type involves capacitance, this value MUST be set.")
    farads_unit = models.CharField(max_length=2, choices=FARAD_UNITS, blank=True, null=True, help_text="If the component type involves capacitance, this value MUST be set.")
    voltage_rating = models.CharField(max_length=3, blank=True)
    tolerance = models.CharField(max_length=3, blank=True)
    notes = models.TextField(blank=True)
    link = models.URLField(blank=False)
    date_updated = models.DateField(default=timezone.now, blank=False)

    class Meta:
        verbose_name_plural = "Components"

    def __str__(self):
        if self.type.name == "Potentiometers":
            return f"{self.name} {self.type.name} ({self.supplier.all().first().name} {self.supplier_item_no})"
        elif self.ohms and self.ohms_unit:
            return f"{self.ohms} {self.ohms_unit} {self.type} ({self.supplier.all().first().name} {self.supplier_item_no})"
        elif self.farads and self.farads_unit:
            return f"{self.farads} {self.farads_unit} {self.type} ({self.supplier.all().first().name} {self.supplier_item_no})"
        else:
            return f"{self.name} {self.type.name} ({self.supplier.all().first().name} {self.supplier_item_no})"

    def clean(self):

        # Resistors
        if (self.type.name == "Resistors" and not self.ohms) or (self.type.name == "Resistors" and not self.ohms_unit):
            raise ValidationError('If this component is a resistor, you must set the Ohm value and unit.')
        if self.type.name == "Resistors" and (self.farads or self.farads_unit):
            raise ValidationError('Farad value and unit must not be set for resistors.')

        # Pots
        if (self.type.name == "Potentiometers" and not self.ohms) or (self.type.name == "Potentiometers" and not self.ohms_unit):
            raise ValidationError('If this component is a resistor, you must set the Ohm value and unit.')
        if self.type.name == "Potentiometers" and (self.farads or self.farads_unit):
            raise ValidationError('Farad value and unit must not be set for resistors.')

        # Capacitors
        if (self.type.name == "Capacitors" and not self.farads) or (self.type.name == "Capacitors" and not self.farads_unit):
            raise ValidationError('If this component is a capacitor, you must set the Farad value and unit.')
        if self.type.name == "Capacitors" and (self.ohms or self.ohms_unit):
            raise ValidationError('Ohm value and unit must not be set for capacitors.')

