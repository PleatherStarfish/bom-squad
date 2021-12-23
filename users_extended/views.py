from django.shortcuts import render, redirect
from users_extended.models import UserExtended, Module
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.views.generic import DetailView


# Create your views here.
@login_required()
def user_page(request, **kwargs):
    built = None
    if request.user.is_authenticated:
        user = UserExtended.objects.get(user=request.user)
        built = user.built_modules.all()
    user_page = get_object_or_404(UserExtended, slug=kwargs.get('slug'))
    return render(request, 'users/index.html', {'user': user_page, "built": built})


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
