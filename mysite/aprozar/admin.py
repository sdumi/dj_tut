from mysite.aprozar.models import *
from django.contrib import admin

class StoreDetailsInline(admin.TabularInline):
    model = StoreDetails

class StoreAdmin(admin.ModelAdmin):
    inlines = [StoreDetailsInline]

admin.site.register(Store, StoreAdmin)
#admin.site.register(StoreDetails)
admin.site.register(Producers)
admin.site.register(Categories)
admin.site.register(Products)
