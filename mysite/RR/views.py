import json
import datetime
from django.db import connection
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
import threading as th

def round_robin(request):
	if request.method == 'GET':
		threads = list()
		respuesta = []
		try:
			for i in range(3):
			    t = th.Thread(target=proceso, args=(i,))
			    context = {}
			    print i
			    threads.append(t)
			    context['num'] = i
			    respuesta.append(context)

			    t.start()
		except:
			return HttpResponseBadRequest('Bad request')
		return JsonResponse(respuesta, safe=False)
	else:
		return HttpResponseBadRequest('No es un GET')
		

def fifo(request):
	return JsonResponse(request.method)
# Create your views here.

def proceso(cont):
	print "Este es el %s trabajo que hago hoy para Genbeta Dev" % cont
	return