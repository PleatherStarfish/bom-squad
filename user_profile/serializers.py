from rest_framework import serializers

class InventorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    component = serializers.CharField(source='component.description')
    manufacturer = serializers.CharField(source='component.manufacturer.name')
    profile = serializers.CharField(source='profile.user.username')
    quantity = serializers.CharField()
    location = serializers.CharField()