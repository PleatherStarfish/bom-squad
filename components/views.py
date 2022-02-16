from django.shortcuts import render
from components.models import Component


# Create your views here.
def index(request):
    components = Component.objects.order_by('type__name')

    context = {"components": components}

    return render(request, 'components/index.html', context)

def search_results(request):
    query = request.GET.get("q")
    # if query:
    #     module_list = Module.objects.filter(Q(name__icontains=query) | Q(manufacturer__name__icontains=query))
    #     context = {"module_list": module_list}
    #     return render(request, 'home/home.html', context)
    # else:
        # return redirect(index)