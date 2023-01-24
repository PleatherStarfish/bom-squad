from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import SignUpForm

def home(request):
    return render(request, 'authenticate/home.html', {"context": "Daniel"})

def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = redirect('home')
            response.set_cookie('userId', user.id)
            return response
        else:
            messages.error(request, ('Invalid username or password.'))
            return redirect('login')
    else:
        return render(request, 'authenticate/login.html', {})

def logout_user(request):
    logout(request)
    messages.success(request, ('You have been logged out.'))
    response = redirect('home')
    response.delete_cookie('userId')
    return response

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
            response = redirect('home')
            response.set_cookie('userId', user.id)
            return response
    else:
        form = SignUpForm()
    context = {'form': form}
    return render(request, 'authenticate/register.html', context)