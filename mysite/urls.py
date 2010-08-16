from django.conf.urls.defaults import *
from django.conf import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'polls/', include('mysite.polls.urls')),
    (r'aprozar/', include('mysite.aprozar.urls')),
    (r'notes/', include('mysite.notes.urls')),
    (r'^media/(?P<path>.*)$', 'django.views.static.server', {'document_root':settings.MEDIA_ROOT}),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    #(r'^latest/$', mysite.books.views.latest_books),
)
