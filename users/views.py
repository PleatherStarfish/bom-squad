from django.shortcuts import render, redirect
from .models import UserExtended
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

# Create your views here.
@login_required()
def user_page(request, slug):
    user_slug = UserExtended.objects.filter(user=slug)
    context = get_object_or_404(UserExtended, slug=user_slug[0].slug)
    return render(request, 'users/index.html', {"context": context})