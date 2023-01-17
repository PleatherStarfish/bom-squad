from rest_framework import serializers
from .models import UserProfileComponentInventoryData
import json

class InventorySerializer(serializers.Serializer):
    component = serializers.CharField(source='component.description')
    manufacturer = serializers.CharField(source='component.manufacturer.name')
    profile = serializers.CharField(source='profile.user.username')
    quantity = serializers.CharField()
    location = serializers.CharField()
    zipped_data = serializers.SerializerMethodField()

    def get_zipped_data(self, obj):
        location_string = json.dumps(obj.location).replace('"', '').replace('[', '').replace(']', '')
        return {location_string:
                {"component": obj.component.description,
                 "manufacturer": obj.component.manufacturer,
                 "profile": obj.profile.user.username,
                 "quantity": obj.quantity}}