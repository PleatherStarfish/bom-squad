from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.shortcuts import redirect
from modules.models import Module
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import SignUpForm


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

    context = {"module_list": module_list}
    return render(request, 'home/home.html', context)

def search_results(request):
    query = request.GET.get("q")
    if query:
        module_list = Module.objects.filter(Q(name__icontains=query) | Q(manufacturer__name__icontains=query))
        context = {"module_list": module_list}
        return render(request, 'home/home.html', context)
    else:
        return redirect(index)

def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, ('You have successfully logged in.'))
            return redirect('home')
        else:
            messages.success(request, ('Login attempt unsuccessful.'))
            return redirect('login')
    else:
        return render(request, 'home/login.html', {})

def logout_user(request):
    logout(request)
    messages.success(request, ('You have been logged out.'))
    return redirect('home')

def register_user(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ('You have registered...'))
            return redirect('home')
    else:
        form = SignUpForm()

    context = {'form': form}
    return render(request, 'home/register.html', context)
