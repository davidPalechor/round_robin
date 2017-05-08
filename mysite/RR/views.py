import json
import datetime
import time
import threading as th
import Queue as q
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


cola_int = q.PriorityQueue()
retorno = "inicio"
#respuesta = []
listos = []
suspendidos = []
bloqueados = []
ejecutados = []
cola_hilos = q.Queue()


def round_robin(request):
    threads = list()
    global cola_int
    global listos

    if request.method == 'GET':
        try:
            #global respuesta
            #t = th.Thread(target=proceso, args=(i + 1,))
            respuesta = []
            # threads.append(t)
            # respuesta.append(context)
            # t.start()

            for cell in listos:
                cola_int.put((cell['prior'], cell))
                crearHilo(cell['nombre'], cell['tiempo'])

            while not cola_int.empty():
                respuesta.append(cola_int.get()[1])
        except:
            return HttpResponseBadRequest('Bad request')
        print "METHOD GET"
        print respuesta
        listos = respuesta
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
            # print list(cola.queue)
            listos.append(context)
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest('Bad request')


def fifo(request):
    return JsonResponse(request.method)
# Create your views here.


def crearHilo(nombre, tiempo):
    global cola_hilos
    print "Creando Hilo"
    cola_hilos.put(th.Thread(target=proceso, name=nombre, args=(tiempo, nombre,)))


def ejecutarHilos(request):
    if request.method == 'POST':
        try:
            global cola_hilos
            global ejecutados
            global listos

            ejecutados = []
            estado = 'ejecucion'
            hilo = cola_hilos.get()
            print hilo.getName()
            aux = listos
            aux.reverse()
            print aux
            ejecutados.append(aux.pop())
            print ejecutados
            hilo.start()
            return HttpResponse("Ejecutando")
        except:
            return HttpResponseBadRequest("Error Interno")


def listarEjecutados(request):
    if request.method == 'GET':
        try:
            global ejecutados
            return JsonResponse(ejecutados, safe=False)
        except:
            return HttpResponseBadRequest("Error interno")


def proceso(tiempo, hilo):
    evento = th.Event()
    inicio = time.time()
    fin = 1000000000
    seg = 0
    estado = ['listo', 'suspendido', 'bloqueado']
    while (fin - inicio) < tiempo:
        if seg == 3:
            print "Esperando"
            evento.wait(5)
        fin = time.time()
        #print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)
    return
