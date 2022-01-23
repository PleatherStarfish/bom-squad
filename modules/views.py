from django.shortcuts import render, redirect
from components.models import Component
from user_profile.models import UserProfile, Module, UserProfileShoppingListData
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse


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

        # for item in components:
        #     if user.component_inventory.filter(id=item.id).exists():
        #         item["number"] = 9

        # for item in user.userprofilecomponentinventorydata_set.all():
        #     print(item.number)

    return render(request, 'modules/index.html', {
        "module": module,
        "built": built,
        "to_build": to_build,
        "components": components,
        "inventory": inventory
    })


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
