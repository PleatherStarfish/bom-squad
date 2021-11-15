from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.shortcuts import redirect
from modules.models import Module
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


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
