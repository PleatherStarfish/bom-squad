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
from users_extended.models import UserExtended
import urllib
import json
from django.conf import settings
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required


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

            ''' Begin reCAPTCHA validation '''
            recaptcha_response = request.POST.get('g-recaptcha-response')
            url = 'https://www.google.com/recaptcha/api/siteverify'
            values = {
                'secret': settings.RECAPTCHA_PRIVATE_KEY,
                'response': recaptcha_response
            }
            data = urllib.parse.urlencode(values).encode()
            req = urllib.request.Request(url, data=data)
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode())
            ''' End reCAPTCHA validation '''

            form.save()

            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ('You have registered...'))
            user_extended = UserExtended(user=user,
                                         first_name=form.cleaned_data['first_name'],
                                         last_name=form.cleaned_data['last_name'])
            user_extended.save()
            return redirect('home')
    else:
        form = SignUpForm()

    context = {'form': form}
    return render(request, 'home/register.html', context)

@login_required()
def add_to_built(request, id):
    if request.method == 'GET':
        user_id = request.user.id
        user = UserExtended.objects.get(id=user_id)
        module = Module.objects.get(id=id)
        user.want_to_build_modules.add(module)
        user.save()
        print(id)
        return HttpResponseRedirect('/')

