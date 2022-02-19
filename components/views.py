from django.shortcuts import render
from components.models import Component
from django.db.models import Q
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    components = Component.objects.order_by('type__name')

    context = {"components": components}

    return render(request, 'components/index.html', context)

def search_results(request):
    query = request.GET.get("q")
    if query:
        components = Component.objects.filter(Q(description__icontains=query) | Q(manufacturer__name__icontains=query))
        context = {"components": components}
        return render(request, 'components/index.html', context)
    else:
        return redirect(index)

# def data(request):
