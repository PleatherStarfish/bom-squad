from django.shortcuts import render
from modules.models import Module
from users_extended.models import UserExtended
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required

# Create your views here.
def module_detail(request, slug):
    module = Module.objects.filter(slug=slug)
    built = None
    if request.user.is_authenticated:
        user = UserExtended.objects.get(user=request.user)
        built = user.built_modules.all()
    return render(request, 'modules/index.html', {"module_list": module, "built": built})

@login_required()
def add_to_built(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserExtended.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.built_modules.add(module)
        user.save()
        return HttpResponseRedirect('/users/djm/')

@login_required()
def remove_from_built(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserExtended.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.built_modules.remove(module)
        user.save()
        return HttpResponseRedirect('/users/djm/')