from django import template

register = template.Library()


@register.filter
def get_item(queryset, key):
    try:
        return queryset.filter(id=key).first().number
    except:
        return 0
