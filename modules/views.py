from django.shortcuts import render, redirect
from components.models import Component, ComponentSupplier
from user_profile.models import UserProfile, Module, UserProfileShoppingListData
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.core import serializers
import itertools
import json


# Merge lists into list-of-lists, flatten, and make values unique
def unique_flatten(listOfDicts, *args):
    return list(set(itertools.chain.from_iterable([ sub[args[0]][args[1]] for sub in listOfDicts ])))

# Create your views here.
def module_detail(request, slug):
    module = Module.objects.get(slug=slug)
    components = module.component_bom_list.all()

    inventory = None
    built = None
    to_build = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        built = user.built_modules.all()
        to_build = user.want_to_build_modules.all()
        inventory = user.userprofilecomponentinventorydata_set.all()

    return render(request, 'modules/index.html', {
        "module": module,
        "built": built,
        "to_build": to_build,
        "components": components,
        "inventory": inventory
    })

def data(request, slug):
    module = Module.objects.get(slug=slug)
    suppliers = ComponentSupplier.objects.all().values()

    suppliers_lookup = {}
    keys = set([i['id'] for i in suppliers])

    for key in keys:
        for l in suppliers:
            if l['id'] == key:
                suppliers_lookup[key] = l


    components = module.component_bom_list.all()
    result = {
        "module": json.loads(serializers.serialize('json', [module])),
        "suppliers": suppliers_lookup,
        "module_bom_list": json.loads(serializers.serialize('json', components)),
    }

    # Since module_bom_list is the BOM item, not the actual component, each entry in module_bom_list
    # has a components_options list, which is a ManyToMany field and is represented as a list of
    # component pk ids. Here we iterate over this list and create a dictionary keying the pk
    # to a JSON representing the component itself. This is used in the react app to display
    # components_options as a nested table under each BOM item
    components_options_dict = {}
    for comp_id in unique_flatten(result["module_bom_list"], "fields", "components_options"):
        if not comp_id in components_options_dict:
            components_options_dict[comp_id] = json.loads(
                serializers.serialize('json', [Component.objects.get(id=comp_id)])
            )

    result["components_options_dict"] = components_options_dict

    # If a user is not logged in, there is no inventory data to display
    result["user_inventory"] = None

    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        inventory = user.userprofilecomponentinventorydata_set.all().values()
        inventory_data = {}
        for entry in inventory:
            name = entry['component_id']  # remove and return the name field to use as a key
            inventory_data[name] = entry

        result["user_inventory"] = inventory_data

    return JsonResponse(result)


@login_required()
def add_to_shopping_list(request, slug, id):
    module = Module.objects.get(slug=slug)
    component = Component.objects.get(id=id)
    user_profile = UserProfile.objects.get(user=request.user)
    quantity = module.component_bom_list.all().get(id=id).quantity
    UserProfileShoppingListData.objects.update_or_create(
        module=module,
        bom_item=module.component_bom_list.all().get(id=id),
        profile=user_profile,
        component=component,
        number=quantity
    )
    return redirect('modules:ModuleDetail', slug=slug)
