from django.shortcuts import render
from modules.models import Module
from users_extended.models import UserExtended, Module

# Create your views here.
def module_detail(request, slug):
    module = Module.objects.filter(slug=slug)

    built = None
    if request.user.is_authenticated:
        user = UserExtended.objects.get(user=request.user)
        built = user.built_modules.all()

    to_build = None
    if request.user.is_authenticated:
        user = UserExtended.objects.get(user=request.user)
        to_build = user.want_to_build_modules.all()

    return render(request, 'modules/index.html', {"module_list": module, "built": built, "to_build": to_build})