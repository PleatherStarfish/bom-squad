from django.shortcuts import render, redirect
from user_profile.models import UserProfile, UserProfileShoppingListData, Module
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django_gravatar.helpers import get_gravatar_url, has_gravatar, get_gravatar_profile_url, calculate_gravatar_hash
from django.http import JsonResponse
from user_profile.models import UserProfile
import json


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
        body = json.loads(body_unicode)
        items_to_add = {key: value for key, value in body.items() if value["add_to_components_list"] == 'true'}

        if UserProfile.objects.filter(user=request.user).exists():
            p = UserProfile.objects.get(user=request.user)
            p.shopping_list_json = json.dumps(items_to_add)
            p.save()
        else:
            print("error")

    return JsonResponse(request.POST)