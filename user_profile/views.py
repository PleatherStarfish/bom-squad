from django.shortcuts import render, redirect
from user_profile.models import UserProfile, Module
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django_gravatar.helpers import get_gravatar_url, has_gravatar, get_gravatar_profile_url, calculate_gravatar_hash


# Create your views here.
@login_required()
def user_page(request, **kwargs):
    user = get_object_or_404(UserProfile, slug=kwargs.get('slug'))

    built = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        built = user.built_modules.all()

    to_build = None
    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)
        to_build = user.want_to_build_modules.all()

    user_email = request.user.email
    username = request.user.username

    gravatar_exists = has_gravatar(user_email)

    return render(request, 'users/index.html', {
        'user': user,
        'built': built,
        'to_build': to_build,
        'user_email': user_email,
        'gravatar_exists': gravatar_exists,
        'username': username,
    })