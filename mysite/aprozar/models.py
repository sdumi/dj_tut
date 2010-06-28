from django.db import models

# Create your models here.
class Store(models.Model):
	name = models.CharField(max_length=200)
	def __unicode__(self):
		return self.name
	
class StoreDetails(models.Model):
	store = models.OneToOneField(Store)
	address = models.CharField(max_length=200)
	telephone = models.CharField(max_length=20)
	def __unicode__(self):
		return store.name

class Producers(models.Model):
	name = models.CharField(max_length=200)
	def __unicode__(self):
		return self.name
	
class Categories(models.Model):
	name = models.CharField(max_length=200)
	def __unicode__(self):
		return self.name

class Products(models.Model):
	name = models.CharField(max_length=200)
	price = models.FloatField()
	store = models.ForeignKey(Store)
	category = models.ForeignKey(Categories)
	producer = models.ForeignKey(Producers)
	def __unicode__(self):
		return self.name