from django.shortcuts import render
from components.models import Component
from django.db.models import Q
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


@method_decorator(csrf_exempt)
def get_components(request):
    if not request.user.is_authenticated():
        return Response({"error": "Method not allowed"}, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == "POST":

        serializer_context = {'request': request}
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        int_id_list = [int(input_id) for input_id in body]

        output = {}
        items = Component.objects.filter(pk__in=int_id_list)
        sorted(items, key=lambda i: int_id_list.index(i.pk))
        for item in items:
            serializer = {"id": item.id, "description": item.description, "manufacturer": item.manufacturer.name,
                          "supplier": item.supplier.name}
            output[item.id] = serializer
        return JsonResponse(output)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
