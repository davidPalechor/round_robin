import json
import datetime
import time
import threading as th
import Queue as q
from .models import *
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


# COLAS DE PROCESOS
listos = Cola()
suspendidos = Cola()
bloqueados = Cola()
ejecutados_p1 = Cola()
ejecutados_p2 = Cola()
ejecutados_p3 = Cola()
terminados = Cola()
estado = ''

# LISTA DE RECURSOS
recursos = []
disponibles = []
en_uso = []

cola_hilos = Cola()


def round_robin(request):
    threads = list()
    global cola_int
    global listos

    if request.method == 'GET':
        try:
            respuesta = []

            # for cell in listos:
            #     cola_int.put((cell['quantum'], cell))
            index = listos.cab
            while index is not None:
                respuesta.append(index.info)
                index = index.sig
        except:
            return HttpResponseBadRequest('Bad request')
        print "METHOD GET"
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
            estado = info['estado']

            context['tiempo'] = tiempo
            context['nombre'] = nombre
            context['quantum'] = quant
            context['recurso'] = recurso
            context['procesador'] = procesador
            context['estado'] = estado

            proceso = Nodo()
            proceso.info = context
            # cola.put((prior, context))
            # print list(cola.queue)

            listos.push(proceso)
            crearHilo(context['nombre'], context['tiempo'],
                      context['recurso'], context['procesador'], context['quantum'])
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


def crearHilo(nombre, tiempo, recurso, procesador, quantum):
    global cola_hilos
    print "Creando Hilo " + nombre

    if procesador == 1:
        hilo = Nodo()
        hilo.info = th.Thread(target=procesador_1,
                              name=nombre, args=(tiempo, quantum, recurso,))
        cola_hilos.push(hilo)
    elif procesador == 2:
        hilo = Nodo()
        hilo.info = th.Thread(target=procesador_2,
                              name=nombre, args=(tiempo, quantum, recurso,))
        cola_hilos.push(hilo)
    else:
        hilo = Nodo()
        hilo.info = th.Thread(target=procesador_3,
                              name=nombre, args=(tiempo, quantum, recurso,))
        cola_hilos.push(hilo)


def ejecutarHilos(request):
    if request.method == 'POST':
        try:
            print "EJECUTANDO HILOS"
            global cola_hilos
            global ejecutados_p1
            global listos

            # ejecutados = []

            ejecutados_p1.push(listos.pop())
            print ejecutados_p1.cab.info['nombre']
            
            if cola_hilos.cab is not None:
                hilo = cola_hilos.pop()
                hilo.info.start()

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
            global ejecutados_p1
            respuesta = []
            proceso = ejecutados_p1.cab
            while proceso is not None:
                respuesta.append(proceso.info)
                proceso = proceso.sig
            print "[ListarEjecutados]" + str(respuesta)
            return JsonResponse(respuesta, safe=False)
        except:
            return HttpResponseBadRequest("No hay items para ejecutar")


def listarSuspendidos(request):
    if request.method == 'GET':
        try:
            global suspendidos
            respuesta = []
            proceso = suspendidos.cab
            
            while proceso is not None:
                respuesta.append(proceso.info)
                proceso = proceso.sig

            print "[ListarSuspendidos]" + str(respuesta)
            return JsonResponse(respuesta, safe=False)
        except:
            return HttpResponseBadRequest("Error interno")


def listarTerminados(request):
    if request.method == 'GET':
        try:
            global terminados
            index = terminados.cab
            respuesta = []

            while index is not None:
                respuesta.append(index.info)
                index = index.sig
            print "LISTA TERMINADOS" + str(terminados.cab.info)
            return JsonResponse(respuesta, safe=False)
        except:
            return HttpResponseBadRequest("Error interno")

def actualizarEstado(request):
    if request.method == "POST":
        try:
            global ejecutados_p1
            ejecutados_p1.cab.info['estado'] = "suspendido"
            return HttpResponse("[SERV] Estado actualizado")
        except:
            return HttpResponseBadRequest("No se pudo actualizar")


def procesador_1(tiempo, quantum, recurso):
    # RECURSOS
    global disponibles
    global en_uso

    # COLAS
    global ejecutados_p1
    global suspendidos
    global bloqueados
    global terminados
    global listos

    # PROCESO ACTUAL
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
    t_restante = 0
    while seg < tiempo:
        if ejecutados_p1.cab is not None:
            estado = ejecutados_p1.cab.info['estado']  
        else:
            estado = 'ejecucion'
            
        if estado == 'suspendido':
            suspendidos.push(ejecutados_p1.pop())
            suspendidos.cab.info['tiempo'] -= seg
            evento.wait(3)
            print "[PROCESADOR 1] Esperando..."
            listos.push(suspendidos.pop())
            listos.cab.info['estado'] = 'ejecucion'
        
        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)

    terminados.push(ejecutados_p1.pop())
    #ejecutados[1] = None
    print terminados.cab.info
    print "PROCESADOR 1: PROCESO " + proceso + " TERMINADO"
    return


def procesador_2(tiempo, quantum, recurso):
    # RECURSOS
    global disponibles
    global en_uso

    # COLAS
    global ejecutados_p1
    global suspendidos
    global bloqueados
    global terminados
    global listos

    # PROCESO ACTUAL
    proceso = th.current_thread().getName()

    if recurso in disponibles:
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso

    evento = th.Event()
    inicio = time.time()
    print "PROCESADOR 2: " + proceso
    fin = 1000000000
    seg = 0
    t_restante = 0
    while seg < tiempo:
        if ejecutados_p1.cab is not None:
            estado = ejecutados_p1.cab.info['estado']  
        else:
            estado = 'ejecucion'
            
        if estado == 'suspendido':
            suspendidos.push(ejecutados_p1.pop())
            suspendidos.cab.info['tiempo'] -= seg
            evento.wait(3)
            print "[PROCESADOR 2] Esperando..."
            listos.push(suspendidos.pop())
            listos.cab.info['estado'] = 'ejecucion'
        
        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)

    terminados.push(ejecutados_p1.pop())
    #ejecutados[1] = None
    print terminados.cab.info
    print "PROCESADOR 2: PROCESO " + proceso + " TERMINADO"
    return


def procesador_3(tiempo, quantum, recurso):
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
