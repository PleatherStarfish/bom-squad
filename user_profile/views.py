from django.shortcuts import render, redirect
from user_profile.models import UserProfile, UserProfileShoppingListData, Module, UserProfileComponentInventoryData
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django_gravatar.helpers import get_gravatar_url, has_gravatar, get_gravatar_profile_url, calculate_gravatar_hash
from django.http import HttpResponse
from user_profile.models import UserProfile
import collections
import json

identical_lists = lambda x, y: collections.Counter(x) == collections.Counter(y)

def merge_shopping_lists(new_dict, old_dict):
    new_dict = dict(new_dict)
    old_dict = dict(old_dict)
    for key, value in new_dict.items():
        if key in old_dict:
            old_dict[key]["quantity"] = old_dict[key]["quantity"] + new_dict[key]["quantity"]
        else:
            old_dict[key] = {}
            old_dict[key]["quantity"] = new_dict[key]["quantity"]
    return old_dict

# def merge_inventory_lists(new_dict, old_dict):
#     new_dict = dict(new_dict)
#     old_dict = dict(old_dict)
#     for key, value in new_dict.items():
#         old_quantity = old_dict[key]["quantity"]
#         old_location = old_dict[key]["location"]
#         new_quantity = new_dict[key]["quantity"]
#         new_location = new_dict[key]["location"]
#
#         if key in old_dict:
#             if isinstance(old_dict[key], list):
#                 pass
#             else:
#                 old_dict[key]["quantity"] = old_quantity + new_quantity
#         else:
#             old_dict[key] = {}
#             old_dict[key]["quantity"] = new_dict[key]["quantity"]
#             old_dict[key]["location"] = new_dict[key]["location"]
#
#     return old_dict



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

    return render(request, 'users/index.html', {
        'current_user': current_user,
        'built': built,
        'to_build': to_build,
        'shopping_list_modules': shopping_list_modules,
        'user_email': user_email,
        'gravatar_exists': gravatar_exists,
        'username': username,
    })

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