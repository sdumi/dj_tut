from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import  RequestContext

# Create your views here.

def main(request):
    p = 5
    return render_to_response('xo/main.html',
                              {'object':p,
                               'error_message':"you idiot"})
#def main(request):
#    return HttpResponse("Hello, world. You're at the poll index.")
