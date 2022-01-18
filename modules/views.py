from django.shortcuts import render
from modules.models import Module
from user_profile.models import UserProfile, Module, UserProfileComponentInventoryData


# Create your views here.
def module_detail(request, slug):
    module = Module.objects.get(slug=slug)

    inventory = None
    if request.user.is_authenticated:
        print(request.user.username)
        inventory = UserProfileComponentInventoryData.objects.filter(profile__user=request.user)
        print(inventory)

    built = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        built = user.built_modules.all()

    to_build = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        to_build = user.want_to_build_modules.all()

    components = module.component_bom_list.all()

    return render(request, 'modules/index.html', {
        "module": module,
        "built": built,
        "to_build": to_build,
        "components": components,
        "inventory": inventory
        }
    )