from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import SignUpForm
from user_profile.models import UserProfile
from django.conf import settings
# from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
import urllib
import json

@login_required
def index(request):
    return render(request, 'users/index.html')

# Create new user
def register(request):
    form = SignUpForm()
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

            if result['success']:
                form.save()
            else:
                messages.error(request, 'Invalid reCAPTCHA. Please try again.')

            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            # login(request, user)
            messages.success(request, ('You have registered...'))
            user_extended = UserProfile(user=user)
            user_extended.save()

            messages.success(request, "Account was created for " + username)
            return redirect('login')

    context = {'form': form}
    return render(request, 'accounts/register.html', context)

# Redirect built-in accounts/profile to the user's slug page
def profile(request):
    user_profile = UserProfile.objects.get(id=request.user.id)
    return redirect('user_page', slug=user_profile.slug)