from django import template

register = template.Library()

@register.filter
def get_item(queryset, key):
    inventory_number = None
    try:
        return queryset.filter(id=key).first().number
    except:
        pass