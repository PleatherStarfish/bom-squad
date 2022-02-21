from django import template

register = template.Library()


@register.filter
def get_item(dictionary, key):
    return dictionary.get(f'{key}') or None
