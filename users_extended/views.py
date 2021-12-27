from django.shortcuts import render, redirect
from users_extended.models import UserExtended, Module
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

# Create your views here.
@login_required()
def user_page(request, **kwargs):
    user = get_object_or_404(UserExtended, slug=kwargs.get('slug'))
    built = None
    if request.user.is_authenticated:
        user = UserExtended.objects.get(user=request.user)
        built = user.built_modules.all()
    return render(request, 'users/index.html', {'user': user, "built": built})