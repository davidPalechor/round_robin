import json
import datetime
import threading as th
import Queue as q
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


retorno = "inicio"


def round_robin(request):
    threads = list()
    respuesta = []
    cola = q.PriorityQueue()
    context = {}
    if request.method == 'GET':
        try:
            #t = th.Thread(target=proceso, args=(i + 1,))

            print retorno
            #threads.append(t)
            # respuesta.append(context)
            #t.start()
            while not cola.empty():
                respuesta = cola.get()[1]
        except:
            return HttpResponseBadRequest('Bad request')
        print respuesta
        return JsonResponse(respuesta, safe=False)
    else:
        try:
            data = request.body
            info = json.loads(data)
            tiempo = info['tiempo']
            nombre = info['nombre']
            recurso = info['recurso']
            prior = info['prior']

            context['tiempo'] = tiempo
            context['nombre'] = nombre
            context['prior'] = prior
            context['recurso'] = recurso

            cola.put((prior, context))
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest('Bad request')


def fifo(request):
    return JsonResponse(request.method)
# Create your views here.


def proceso(cont):
    global retorno
    retorno = "Este es el %s trabajo que hago hoy para Genbeta Dev" % cont
    return
