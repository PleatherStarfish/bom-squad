from modules.models import Module
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from user_profile.models import UserProfile
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.urls import resolve, Resolver404


# Create your views here.
def index(request):
    module_list = Module.objects.order_by('name')

    page = request.GET.get('page', 1)
    paginator = Paginator(module_list, 10)
    try:
        module_list = paginator.page(page)
    except PageNotAnInteger:
        module_list = paginator.page(1)
    except EmptyPage:
        module_list = paginator.page(paginator.num_pages)

    built = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        built = user.built_modules.all()

    to_build = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        to_build = user.want_to_build_modules.all()

    print(to_build)

    context = {"module_list": module_list, "built": built, "to_build": to_build}
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
        print("to_build", id, "..........")
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

