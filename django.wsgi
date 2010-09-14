import os
import sys
os.environ['DJANGO_SETTINGS_MODULE']='mysite.settings'
sys.path.append('/local/www/htdocs/django/dj_tut')
import django.core.handlers.wsgi
application=django.core.handlers.wsgi.WSGIHandler()
