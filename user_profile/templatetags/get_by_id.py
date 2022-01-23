from django import template

register = template.Library()


@register.filter
def get_by_id(queryset, key):
    try:
        return queryset.get(id=key).name
    except:
        return ''
