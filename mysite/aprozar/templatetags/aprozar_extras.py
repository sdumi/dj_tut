from mysite.aprozar.models import Products
from django.template import Library
register = Library()

# using the decorator syntax to register our new inclusion tag: show_results:
@register.inclusion_tag('aprozar/show_results.html')
def show_results(products):
    return {'products' : products}

@register.inclusion_tag('aprozar/search_form.html')
def search_form():
    """
    Displays a search form for searching the list.
    """
    return {
        'show_result_count': False,
        'search_var': 'name'
    }
#search_form = register.inclusion_tag('admin/search_form.html')(search_form)
