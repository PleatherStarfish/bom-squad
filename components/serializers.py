from .models import Component
from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField
import dataclasses, json

class ComponentsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    description = serializers.CharField()
    manufacturer = serializers.CharField()
    supplier = serializers.CharField()
    price = MoneyField(max_digits=6, decimal_places=2)
    supplier_item_no = serializers.CharField()
    short_name = serializers.CharField()
