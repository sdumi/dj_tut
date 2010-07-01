from django.shortcuts import render_to_response
from django.http import HttpResponse
from mysite.aprozar.models import Products
from django.template import Library

register = Library()
# Create your views here.
#def index(request):
#    return HttpResponse("Hello")
def index(request):
    latest_prod_list = Products.objects.all()[:2]
#    return render_to_response('aprozar/index_aprozar.html', {'object_list': latest_prod_list})
    return render_to_response('aprozar/index.html', {'object_list': latest_prod_list})
