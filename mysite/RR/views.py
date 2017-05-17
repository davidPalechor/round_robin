import json
import datetime
import time
import threading as th
import Queue as q
import math
from .models import *
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


# COLAS DE PROCESOS
# Procesador 1
listos = Cola()
suspendidos = Cola()
bloqueados = Cola()
ejecutados_p1 = Cola()
terminados = Cola()

# PROCESADOR 2
listos_p2 = Cola()
suspendidos_p2 = Cola()
bloqueados_p2 = Cola()
ejecutados_p2 = Cola()
terminados_p2 = Cola()

# LISTA DE RECURSOS
recursos = []
disponibles = []
en_uso = []

cola_hilos = Cola()


def round_robin(request):
    threads = list()
    global cola_int
    # global listos

    if request.method == 'GET':
        try:
            respuesta = [[], [], []]

            # for cell in listos:
            #     cola_int.put((cell['quantum'], cell))
            index = listos.cab
            while index is not None:
                respuesta[0].append(index.info)
                index = index.sig

            index = listos_p2.cab
            while index is not None:
                respuesta[1].append(index.info)
                index = index.sig

        except:
            return HttpResponseBadRequest('Bad request')
        # print "METHOD GET ", respuesta
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
            procesador = info['procesador']
            estado = info['estado']

            context['tiempo'] = tiempo
            context['nombre'] = nombre
            context['recurso'] = recurso
            context['procesador'] = procesador
            context['estado'] = estado
            context['quantum'] = tiempo

            proceso = Nodo()

            if int(procesador) == 1:
                context['quantum'] = calcularQuantum(listos, tiempo)
                proceso.info = context
                print "Proceso a Procesador 1"
                listos.push(proceso)
            if int(procesador) == 2:
                context['quantum'] = calcularQuantum(listos_p2, tiempo)
                proceso.info = context
                print "Proceso a Procesadro 2"
                listos_p2.push(proceso)

            crearHilo(context['nombre'], context['tiempo'],
                      context['recurso'], context['procesador'], context['quantum'])
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest('Bad request')


def calcularQuantum(cola, tiempo):
    quantum = 0
    num = 0
    if cola.isVacia():
        quantum = tiempo
    else:
        item = cola.cab
        while item is not None:
            quantum += item.info['tiempo']
            num += 1
            item = item.sig
        quantum = int(round(quantum / num))        
        if tiempo >= quantum:
            quantum = int(math.ceil(quantum * 2 / 3))
        else:
            quantum = int(math.ceil(tiempo * 2 / 3))
        
    return quantum


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

    if int(procesador) == 1:
        hilo = Nodo()
        hilo.info = th.Thread(target=procesador_1,
                              name=nombre, args=(tiempo, quantum, recurso,))
        cola_hilos.push(hilo)
    elif int(procesador) == 2:
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

            if listos.cab is not None:
                ejecutados_p1.push(listos.pop())
                ejecutados_p1.cab.info['estado'] = "ejecucion"

            if listos_p2.cab is not None:
                ejecutados_p2.push(listos_p2.pop())
                ejecutados_p2.cab.info['estado'] = 'ejecucion'
            

            if cola_hilos.cab is not None:
                hilo = cola_hilos.pop()
                hilo.info.start()

            return HttpResponse("Ejecutando")
        except Exception as e:
            return HttpResponseBadRequest("Error Interno: "+str(e))


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
            return HttpResponseBadRequest("[DJANGO] Error al crear recurso")
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
            respuesta = [[],[],[]]
            proceso = ejecutados_p1.cab
            while proceso is not None:
                respuesta[0].append(proceso.info)
                proceso = proceso.sig
            
            proceso = ejecutados_p2.cab
            while proceso is not None:
                respuesta[1].append(proceso.info)
                proceso = proceso.sig

            print "[ListarEjecutados]" + str(respuesta)
            return JsonResponse(respuesta, safe=False)
        except Exception as e:
            return HttpResponseBadRequest("No hay items para ejecutar " + str(e))


def listarSuspendidos(request):
    if request.method == 'GET':
        try:
            global suspendidos
            respuesta = [[],[],[]]
            proceso = suspendidos.cab

            while proceso is not None:
                respuesta[0].append(proceso.info)
                proceso = proceso.sig

            
            proceso = suspendidos_p2.cab
            while proceso is not None:
                respuesta[1].append(proceso.info)
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
            respuesta = [[],[],[]]

            while index is not None:
                respuesta[0].append(index.info)
                index = index.sig

            index = terminados_p2.cab
            while index is not None:
                respuesta[1].append(index.info)
                index = index.sig
            print "LISTA TERMINADOS" + str(respuesta)
            return JsonResponse(respuesta, safe=False)
        except:
            return HttpResponseBadRequest("Error interno")


def actualizarEstado(request):
    if request.method == "POST":
        try:
            global ejecutados_p1
            global ejecutados_p2
            if ejecutados_p1.cab is not None:
                ejecutados_p1.cab.info['estado'] = "suspendido"
            return HttpResponse("[SERV] Estado actualizado")
        except:
            return HttpResponseBadRequest("No se pudo actualizar")

def actualizarEstado_2(request):
    if request.method == "POST":
        try:
            global ejecutados_p2
            if ejecutados_p2.cab is not None:
                ejecutados_p2.cab.info['estado'] = "suspendido"
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

    cv = th.Condition()
    if recurso in disponibles:
        cv.acquire()
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso
    else:
        cv.acquire()
        while recurso not in disponibles:
            cv.wait()

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
            estado = 'listo'

        if estado == 'suspendido':
            suspendidos.push(ejecutados_p1.pop())
            suspendidos.cab.info['tiempo'] -= seg
            print "[PROCESADOR 1] Esperando..."
            quantum = calcularQuantum(listos,suspendidos.cab.info['tiempo'])
            evento.wait(3)
            listos.push(suspendidos.pop())
            listos.cab.info['estado'] = 'listo'
            listos.cab.info['quantum'] = quantum
            estado = 'listo'

            ejecutados_p1.push(listos.pop())
        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)

    terminados.push(ejecutados_p1.pop())
    disponibles.append(en_uso.pop())
    cv.notify()
    cv.release()
    #ejecutados[1] = None
    # print terminados.cab.info
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

    cv = th.Condition()
    if recurso in disponibles:
        cv.acquire()
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso
    else:
        cv.acquire()
        while recurso not in disponibles:
            cv.wait()

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
            evento.wait(3)

        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)

    terminados_p2.push(ejecutados_p2.pop())
    #ejecutados[1] = None
    print terminados_p2.cab.info
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
