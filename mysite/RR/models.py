from __future__ import unicode_literals

from django.db import models

class Proceso(models.Model):
	tiempo = models.CharField(max_length=60)
# Create your models here.
