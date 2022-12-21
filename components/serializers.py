from .models import Component
from rest_framework import serializers


class ComponentsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    description = serializers.CharField()
    manufacturer = serializers.CharField()
    supplier = serializers.CharField()