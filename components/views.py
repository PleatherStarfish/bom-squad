from django.shortcuts import render
from components.models import Component
from django.db.models import Q
from django.shortcuts import render, redirect
from components.column_names import columns
from django.contrib.auth.decorators import login_required


# Create your views here.
def index(request):

    components = Component.objects.order_by('type__name')

    context = {"components": components, "columns": columns}

    return render(request, 'components/index.html', context)

def search_results(request):
    query = request.GET.get("q")
    if query:
        components = Component.objects.filter(Q(description__icontains=query) | Q(manufacturer__name__icontains=query))
        context = {"components": components}
        return render(request, 'components/index.html', context)
    else:
        return redirect(index)

@login_required()
def add_to_components_list(request):
    if request.method == 'POST':
        quantity = request.POST['quantity']
        location = request.POST['location']
        user = request.user
        print(user)
    return redirect(index)

def add_to_shopping_list(request):
    pass