from mysite.aprozar.models import Products
from django.template import Library
register = Library()

# using the decorator syntax to register our new inclusion tag: show_results:
@register.inclusion_tag('aprozar/show_results.html')
def show_results(products):
#    products = Products.objects.all()
    return {'products' : products}
#register.tag('results', show_results)

def search_form(cl):
    """
    Displays a search form for searching the list.
    """
    return {
        'cl': cl,
        'show_result_count': cl.result_count != cl.full_result_count,
        'search_var': SEARCH_VAR
    }
search_form = register.inclusion_tag('admin/search_form.html')(search_form)
