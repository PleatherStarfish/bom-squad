from django.shortcuts import render
from modules.models import Module
from user_profile.models import UserProfile, Module, UserProfileComponentInventoryData


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
        }
    )