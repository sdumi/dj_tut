from django.shortcuts import render_to_response
from django.http import HttpResponse
from mysite.aprozar.models import Products
from django.template import Library, RequestContext

register = Library()
# Create your views here.
#def index(request):
#    return HttpResponse("Hello")
def index(request):
    latest_prod_list = Products.objects.all()[:25]
#    return render_to_response('aprozar/index_aprozar.html', {'object_list': latest_prod_list})
    return render_to_response('aprozar/index.html', {'object_list': latest_prod_list})



# from http://www.julienphalip.com/blog/2008/08/16/adding-search-django-site-snap/
def search(request):
    query_string = ''
    found_entries = None
#    search_this = request.GET['search']
#    try:
    if ('q' in request.GET) and request.GET['q'].strip():
        query_string = request.GET['q']
        entry_query = get_query(query_string, ['name',])
        found_entries = Products.objects.filter(entry_query)
    return render_to_response('aprozar/results.html',
                              {'query_string' : query_string,
                               'found_entries' : found_entries},
                              context_instance=RequestContext(request))


        
import re
from django.db.models import Q

def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):
    ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
        and grouping quoted words together.
        Example:
        
        >>> normalize_query('  some random  words "with   quotes  " and   spaces')
        ['some', 'random', 'words', 'with quotes', 'and', 'spaces']
    
    '''
    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)] 

def get_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.
    
    '''
    query = None # Query to search for every search term        
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query
