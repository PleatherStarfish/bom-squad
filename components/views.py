from django.shortcuts import render
from components.models import Component
from django.db.models import Q
from rest_framework.decorators import api_view
from django.shortcuts import render, redirect
from components.column_names import columns
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from components.serializers import ComponentsSerializer
from django.http import HttpResponse, JsonResponse
import json


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


@api_view(['POST'])
def get_components(request):
    int_id_list = [int(input_id) for input_id in request.data]
    items = Component.objects.filter(pk__in=int_id_list)
    sorted_items = sorted(items, key=lambda i: int_id_list.index(i.pk))
    output = {item.id: {
        "id": item.id,
        "description": item.description,
        "manufacturer": item.manufacturer.name,
        "supplier": item.supplier.name,
        "price": f"{str(item.price.amount)} {str(item.price.currency)}" if item.price else None,
        "item_no": item.supplier_item_no,
        "supplier_short_name": item.supplier.short_name
    } for item in sorted_items}
    return JsonResponse(output)
