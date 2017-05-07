import json
import datetime
import threading as th
import Queue as q
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


cola = q.PriorityQueue()
retorno = "inicio"

lista_cola = []

def round_robin(request):
    threads = list()
    global cola
    global lista_cola

    if request.method == 'GET':
        try:
            respuesta = []
            #global respuesta
            #t = th.Thread(target=proceso, args=(i + 1,))

            print retorno
            #threads.append(t)
            # respuesta.append(context)
            #t.start()

            for cell in lista_cola:
                cola.put((cell['prior'], cell))

            while not cola.empty():
                respuesta.append(cola.get()[1])
        except:
            return HttpResponseBadRequest('Bad request')
        print "METHOD GET"
        print respuesta
        return JsonResponse(respuesta, safe=False)
    else:
        try:
            context = {}
            print "METHOD POST"
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

            #cola.put((prior, context))
            #print list(cola.queue)
            lista_cola.append(context)
            print list(lista_cola)
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
