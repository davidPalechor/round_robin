import json
import datetime
import time
import threading as th
import Queue as q
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


cola_int = q.PriorityQueue()
retorno = "inicio"
# respuesta = []
# LISTAS DE PROCESOS
listos = []
suspendidos = []
bloqueados = []
ejecutados = [None, None, None]
terminados = []

# LISTA DE RECURSOS
recursos = []
disponibles = []
en_uso = []

cola_hilos = q.Queue()


def round_robin(request):
    threads = list()
    global cola_int
    global listos

    if request.method == 'GET':
        try:
            # global respuesta
            # t = th.Thread(target=proceso, args=(i + 1,))
            respuesta = []
            # threads.append(t)
            # respuesta.append(context)
            # t.start()

            for cell in listos:
                cola_int.put((cell['quantum'], cell))

            while not cola_int.empty():
                respuesta.append(cola_int.get()[1])
        except:
            return HttpResponseBadRequest('Bad request')
        print "METHOD GET"
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
            quant = info['quantum']
            procesador = info['procesador']

            context['tiempo'] = tiempo
            context['nombre'] = nombre
            context['quantum'] = quant
            context['recurso'] = recurso
            context['procesador'] = procesador

            # cola.put((prior, context))
            # print list(cola.queue)

            listos.append(context)
            print context['tiempo']
            crearHilo(context['nombre'], context['tiempo'],
                      context['recurso'], context['procesador'])
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest('Bad request')


def listaListos(request):
    try:
        global listos
        print "LISTA LISTOS"
        return JsonResponse(listos, safe=False)
    except:
        return HttpResponseBadRequest("Error en la lista")


def crearHilo(nombre, tiempo, recurso, procesador):
    global cola_hilos
    print "Creando Hilo " + nombre

    if procesador == 1:
        cola_hilos.put(th.Thread(target=procesador_1,
                                 name=nombre, args=(tiempo, nombre, recurso,)))
    elif procesador == 2:
        cola_hilos.put(th.Thread(target=procesador_2,
                                 name=nombre, args=(tiempo, nombre, recurso,)))
    else:
        cola_hilos.put(th.Thread(target=procesador_3,
                                 name=nombre, args=(tiempo, nombre, recurso,)))


def ejecutarHilos(request):
    if request.method == 'POST':
        try:
            print "EJECUTANDO HILOS"
            global cola_hilos
            global ejecutados
            global listos

            ejecutados = [None, None, None]
            estado = 'ejecucion'
            hilo = cola_hilos.get()
            aux = listos
            aux.reverse()
            # listos.reverse
            ejecutados[1] = aux.pop()
            # listos.reverse()
            hilo.start()

            return HttpResponse("Ejecutando")
        except:
            return HttpResponseBadRequest("Error Interno")


def manejoRecursos(request):
    global recursos
    global disponibles
    if request.method == 'POST':
        try:

            context = {}
            data = request.body
            info = json.loads(data)

            recurso = info['value']

            context['recurso'] = recurso

            recursos.append(context)
            disponibles.append(recurso)
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest("{DJANGO] Error al crear recurso")
    if request.method == 'GET':
        try:
            print "RECURSOS"
            print recursos
            return JsonResponse(recursos, safe=False)
        except:
            return HttpResponseBadRequest("ERROR INTERNO")


def listarEjecutados(request):
    if request.method == 'GET':
        try:
            global ejecutados
            print "LISTA EJECUTADOS"
            return JsonResponse(ejecutados[1], safe=False)
        except:
            return HttpResponseBadRequest("Error interno")

def listarTerminados(request):
    if request.method == 'GET':
        try:
            global terminados
            print "LISTA TERMINADOS"
            return JsonResponse(terminados, safe=False)
        except:
            return HttpResponseBadRequest("Error interno")

def procesador_1(tiempo, hilo, recurso):
    # RECURSOS
    global disponibles
    global en_uso

    # COLAS
    global ejecutados
    global suspendidos
    global bloqueados
    global terminados

    #PROCESO ACTUAL
    proceso = th.current_thread().getName()

    if recurso in disponibles:
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso

    evento = th.Event()
    inicio = time.time()
    print "PROCESADOR 1: " + proceso
    fin = 1000000000
    seg = 0
    while (fin - inicio) < tiempo:

        fin = time.time()
        # print hilo + " " + str(fin - inicio)
    seg = round(fin - inicio)
    
    terminados.append(ejecutados[1])
    ejecutados[1] = None
    print terminados
    print "PROCESADOR 1: PROCESO " + proceso + " TERMINADO" 
    return


def procesador_2(tiempo, hilo, recurso):
    evento = th.Event()
    inicio = time.time()
    fin = 1000000000
    seg = 0
    while (fin - inicio) < tiempo:

        seg = round(fin - inicio)
    return


def procesador_3(tiempo, hilo, recurso):
    evento = th.Event()
    inicio = time.time()
    fin = 1000000000
    seg = 0
    while (fin - inicio) < tiempo:
        if seg == 3:
            print "Esperando"
            evento.wait(5)
        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)
    return
