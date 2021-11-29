from django.shortcuts import render
from modules.models import Module

# Create your views here.
def module_detail(request, slug):
    module = Module.objects.filter(slug=slug)
    context = {"module_list": module}
    return render(request, 'modules/index.html', context)