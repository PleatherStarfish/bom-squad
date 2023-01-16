from modules.models import Module
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from user_profile.models import UserProfile
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.urls import resolve, Resolver404
from django.shortcuts import get_object_or_404
from django.contrib import messages


# Create your views here.
def index(request):
    user = request.user
    is_authenticated = user.is_authenticated
    module_list = Module.objects.order_by('name')

    # Pagination
    paginator = Paginator(module_list, 10)
    page = request.GET.get('page', 1)

    try:
        module_list = paginator.page(page)
    except PageNotAnInteger:
        module_list = paginator.page(1)
    except EmptyPage:
        module_list = paginator.page(paginator.num_pages)

    # User-specific data
    built = None
    to_build = None
    if is_authenticated:
        user_profile = UserProfile.objects.get(user=user)
        built = user_profile.built_modules.all()
        to_build = user_profile.want_to_build_modules.all()

    context = {
        "module_list": module_list,
        "built": built,
        "to_build": to_build,
        "is_authenticated": is_authenticated,
    }
    return render(request, 'home/home.html', context)

def search_results(request):
    query = request.GET.get("q")
    if query:
        module_list = Module.objects.filter(Q(name__icontains=query) | Q(manufacturer__name__icontains=query))
        context = {"module_list": module_list}
        return render(request, 'home/home.html', context)
    else:
        return redirect(index)

@login_required()
def add_to_built(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserProfile.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.built_modules.add(module)
        user.want_to_build_modules.remove(module)
        user.save()
        url = request.GET.get("next")
        try:
            resolve(url)
            return HttpResponseRedirect(url)
        except Resolver404:
            return redirect("default_view")

@login_required()
def remove_from_built(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserProfile.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.built_modules.remove(module)
        user.save()
        url = request.GET.get("next")
        try:
            resolve(url)
            return HttpResponseRedirect(url)
        except Resolver404:
            return redirect("default_view")

@login_required()
def add_to_to_build(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserProfile.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.want_to_build_modules.add(module)
        user.built_modules.remove(module)
        user.save()
        url = request.GET.get("next")
        try:
            resolve(url)
            return HttpResponseRedirect(url)
        except Resolver404:
            return redirect("default_view")

@login_required()
def remove_from_to_build(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserProfile.objects.get(user__id=user_id)
        module = Module.objects.get(id=id)
        user.want_to_build_modules.remove(module)
        user.save()
        url = request.GET.get("next")
        try:
            resolve(url)
            return HttpResponseRedirect(url)
        except Resolver404:
            return redirect("default_view")

