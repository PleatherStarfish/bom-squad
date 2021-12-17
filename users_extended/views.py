from django.shortcuts import render, redirect
from users_extended.models import UserExtended, Module
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView

# Create your views here.
@login_required()
def user_page(request, **kwargs):
    context = {}
    context['user'] = get_object_or_404(UserExtended, slug=kwargs.get('slug'))
    return render(request, 'users/index.html', context)