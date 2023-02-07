from django.shortcuts import render, redirect
from user_profile.models import UserProfile, UserProfileShoppingListData, Module, UserProfileComponentInventoryData
from components.models import Component
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django_gravatar.helpers import get_gravatar_url, has_gravatar, get_gravatar_profile_url, calculate_gravatar_hash
from django.http import HttpResponse
from user_profile.models import UserProfile
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import collections
from django import template
from django.db.models import JSONField
from user_profile.serializers import InventorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
import json

identical_lists = lambda x, y: collections.Counter(x) == collections.Counter(y)

def merge_shopping_lists(new_dict, old_dict):
    for key, value in new_dict.items():
        old_dict[key] = old_dict.get(key, {"quantity": 0})
        old_dict[key]["quantity"] += value["quantity"]

# Create your views here.
@login_required()
def user_page(request, **kwargs):

    built = None
    to_build = None

    current_user = UserProfile.objects.get(user=request.user)
    built = current_user.built_modules.all()
    to_build = current_user.want_to_build_modules.all()
    shopping_list_modules = UserProfileShoppingListData.objects.values("module").distinct()
    all_components_for_shopping_list = UserProfileShoppingListData.objects.values("component").distinct()

    user_email = request.user.email
    username = request.user.username

    gravatar_exists = has_gravatar(user_email)

    inventory = UserProfileComponentInventoryData.objects.all()
    location_strings = [json.dumps(item.location).replace('"', '').replace('[', '').replace(']', '') for item in inventory]
    zipped_data = zip(location_strings, inventory)
    context = {
        'current_user': current_user,
        'zipped_data': zipped_data,
        'built': built,
        'to_build': to_build,
        'shopping_list_modules': shopping_list_modules,
        'user_email': user_email,
        'gravatar_exists': gravatar_exists,
        'username': username,
    }

    return render(request, 'users/index.html', context)


@login_required()
@api_view(['GET'])
def user_inventory(request, **kwargs):
    user = UserProfile.objects.filter(user=request.user).first()
    inventory = UserProfileComponentInventoryData.objects.filter(profile=user)
    serializer = InventorySerializer(inventory, many=True)
    return Response(serializer.data)

@login_required()
def addComponentsToShoppingList(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        new_data = json.loads(body_unicode)

        # If empty data is submitted, return 203
        if not new_data.keys():
            return HttpResponse(status=204)

        # Make sure user is logged in
        if UserProfile.objects.get(user=request.user):

            # Get user's profile data
            user_data = UserProfile.objects.get(user=request.user)

            # If "user_data.shopping_list_json" is empty
            if not isinstance(user_data.shopping_list_json, dict):
                user_data.shopping_list_json = new_data
                user_data.save()
                return HttpResponse(status=200)

            # Iterate over module ids (as well as the anonymous category) and merge sub dicts by adding quantities
            for key, value in new_data.items():
                user_data.shopping_list_json[key] = merge_shopping_lists(new_data[key], user_data.shopping_list_json[key])

            user_data.save()
            return HttpResponse(status=200)

        else:
            # If user profile isn't found
            return redirect('login')
    else:
        # If not a POST request
        return HttpResponse(status=405)

@login_required()
def addComponentsToComponentInventoryList(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        # If empty data is submitted, return 204
        if not body:
            return HttpResponse(status=204)

        # Get user's profile data
        user_profile = UserProfile.objects.get(user=request.user)

        for component_id, data in body.items():
            location = data.get("location", None)
            quantity = data["quantity"]

            try:
                inventory_item = UserProfileComponentInventoryData.objects.filter(component=component_id, profile=user_profile).all()
                if inventory_item:
                    for item in inventory_item:
                        if item.location == location:
                            item.quantity += int(quantity)
                            item.save()
                        else:
                            new_inventory_item = UserProfileComponentInventoryData.objects.create(
                                component_id=int(component_id), profile=user_profile,
                                quantity=quantity, location=location)
                            new_inventory_item.save()
                else:
                    new_inventory_item = UserProfileComponentInventoryData.objects.create(
                        component_id=int(component_id), profile=user_profile,
                        quantity=quantity, location=location)
                    new_inventory_item.save()

            except UserProfileComponentInventoryData.DoesNotExist:
                UserProfileComponentInventoryData.objects.create(component_id=component_id, profile=user_profile, quantity=quantity, location=location)

        return HttpResponse(status=200)

    else:
        # If not a POST request
        return HttpResponse(status=405)


import csv
from django.http import HttpResponse

def export_inventory_data_csv(request):
    inventory_data = UserProfileComponentInventoryData.objects.prefetch_related('component').values(
        'component__description',
        'quantity',
        'location'
    )
    new_data = []
    for data in inventory_data:
        if data['location']:
            for location in data['location']:
                new_data.append({
                    'component__description': data['component__description'],
                    'quantity': data['quantity'],
                    'location': location
                })
        else:
            new_data.append({
                'component__description': data['component__description'],
                'quantity': data['quantity'],
                'location': None
            })
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="inventory_data.csv"'

    writer = csv.DictWriter(response, fieldnames=['component__description','quantity','location'])
    writer.writeheader()
    for item in new_data:
        writer.writerow(item)

    return response
@login_required()
def update_inventory(request):
    if request.method == 'PUT':

        # Get data from the PUT request body
        data = json.loads(request.body)

        # Get the id of the inventory item to update
        id = data['id']

        # Get the new value for the field that needs to be updated
        new_value = data['value']

        # Get the field that needs to be updated
        field = data.get('field')

        try:
            # Get the user profile of the logged-in user
            user_profile = UserProfile.objects.get(user=request.user)

            # Get the inventory item that needs to be updated
            user_profile_component_inventory_data = UserProfileComponentInventoryData.objects.get(id=id, profile=user_profile)

            # Check if the logged in user is authorized to update this inventory
            if request.user.id != user_profile_component_inventory_data.profile.user.id:
                return JsonResponse({'error': 'You are not authorized to update this inventory'}, status=401)

            # Update the quantity field if the field is 'quantity'
            if field == 'quantity':
                user_profile_component_inventory_data.quantity = new_value

            # Update the location field if the field is 'location'
            elif field == 'location':
                user_profile_component_inventory_data.location = new_value

            # Save the updated inventory item
            user_profile_component_inventory_data.save()
            return JsonResponse({'success': 'Inventory updated successfully'}, status=200)
        except UserProfileComponentInventoryData.DoesNotExist:
            return JsonResponse({'error': 'Inventory not found'}, status=404)
        except UserProfileComponentInventoryData.DoesNotExist:
            return JsonResponse({'status': 'error'})

@login_required
def update_inventory_quantity(request, pk):
    inventory = get_object_or_404(UserProfileComponentInventoryData, pk=pk)
    if request.method == 'PATCH':
        if inventory.profile.user != request.user:
            return JsonResponse({'error': 'You do not have permission to update this inventory'}, status=403)
        data = json.loads(request.body)
        inventory.quantity = data['quantity']
        inventory.save()
        return JsonResponse({'message': 'Inventory quantity updated successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def update_inventory_location(request, pk):
    inventory = get_object_or_404(UserProfileComponentInventoryData, pk=pk)
    if request.method == 'PATCH':
        if inventory.profile.user != request.user:
            return JsonResponse({'error': 'You do not have permission to update this inventory'}, status=403)
        data = json.loads(request.body)
        inventory.location = data['location']
        inventory.save()
        return JsonResponse({'message': 'Inventory location updated successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def delete_inventory_item(request, pk):
    inventory = get_object_or_404(UserProfileComponentInventoryData, pk=pk)
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    if request.user != inventory.profile.user:
        return JsonResponse({'error': 'You do not have permission to delete this inventory'}, status=403)

    inventory.delete()

    return JsonResponse({'message': 'Inventory item deleted'})

