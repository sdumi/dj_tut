from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template import  RequestContext
from mysite.polls.models import Poll, Choice

####################
def vote(request, object_id):
    p = get_object_or_404(Poll, pk=object_id)
    try:
        selected_choice = p.choice_set.get(pk=request.POST['choice'])
    except(KeyError, Choice.DoesNotExist):
        #Redisplay the poll voting form.
        return render_to_response('polls/poll_detail.html', {
                'object': p,
                'error_message':"You didn't select a choice.",
        }, context_instance=RequestContext(request))
    else:
        selected_choice.votes += 1
        selected_choice.save()
        #Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents dta from being posted twice if a
        # user hits the Back button.
#        return HttpResponseRedirect(reverse('mysite.polls.views.results', args=(p.id,)))
        return HttpResponseRedirect(reverse('poll_results', args=(p.id,)))
