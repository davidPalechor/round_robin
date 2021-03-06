import json
import datetime
import time
import threading as th
import Queue as q
import math
from .models import *
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse


# COLAS DE PROCESOS
# Procesador 1ef isVacia(self):
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

#PROCESADOR 3
listos_p3 = Cola()
suspendidos_p3 = Cola()
bloqueados_p3 = Cola()
ejecutados_p3 = Cola()
terminados_p3 = Cola()

# LISTA DE RECURSOS
recursos = []
disponibles = []
en_uso = []

cola_hilos = Cola()
cola_hilos_2 = Cola()
cola_hilos_3 = Cola()


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

            index = listos_p3.cab
            while index is not None:
                respuesta[2].append(index.info)
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
            prioridad = info['prioridad']

            aux = cifrar("sistemas",nombre)
            print aux
            context['tiempo'] = tiempo
            context['nombre'] = aux
            context['recurso'] = recurso
            context['procesador'] = procesador
            context['estado'] = estado
            context['quantum'] = tiempo
            context['prioridad'] = 'sistema'

            proceso = Nodo()

            if int(procesador) == 1:
                context['quantum'] = calcularQuantum(listos, tiempo)
                proceso.info = context
                print "Proceso a Procesador 1"
                listos.push(proceso)
            if int(procesador) == 2:
                context['quantum'] = calcularQuantum(listos_p2, tiempo)
                proceso.info = context
                print "Proceso a Procesador 2"
                listos_p2.push(proceso)
            
            if int(procesador) == 3:
                context['quantum'] = calcularQuantum(listos_p3, tiempo)
                proceso.info = context
                print "Proceso a Procesador 3"
                listos_p3.push(proceso)

            crearHilo(context['nombre'], context['tiempo'],
                      context['recurso'], context['procesador'], context['quantum'])
            return HttpResponse("Success!")
        except:
            return HttpResponseBadRequest('Bad request')

def init(request):
    if request.method == 'POST':
        try:

            print "Inicializando"
            while not listos.isVacia():
                listos.pop()
            while not listos_p2.isVacia():
                listos_p2.pop()
            while not listos_p3.isVacia():
                listos_p3.pop()

            return HttpResponse('Success')
        except Exception as e:
            return HttpResponseBadRequest('Error Interno: ' + str(e))

abc="abcdefghijklmnopqrstuvwxyz123456789"

def cifrar(palabra, clave):
    text_cifrar=''
    i=0
    for letra in palabra:
        suma=abc.find(letra) + abc.find(clave[i % len(clave)])
        modulo=int(suma) % len(abc)
        text_cifrar=text_cifrar+str(abc[modulo])
        i=i+1
    
    return text_cifrar

def descifrar(palabra, clave):
    text_cifrar=''
    i=0
    for letra in palabra:
        suma=abc.find(letra) - abc.find(clave[i % len(clave)])
        modulo=int(suma) % len(abc)
        text_cifrar=text_cifrar+str(abc[modulo])
        i=i+1
    
    return text_cifrar

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
        cola_hilos_2.push(hilo)
    else:
        hilo = Nodo()
        hilo.info = th.Thread(target=procesador_3,
                              name=nombre, args=(tiempo, quantum, recurso,))
        cola_hilos_3.push(hilo)


def ejecutarHilos(request):
    if request.method == 'POST':
        try:
            print "EJECUTANDO HILOS"
            global cola_hilos
            global ejecutados_p1
            global listos

            if listos.cab is not None:
                if ejecutados_p1.cab is None:
                    ejecutados_p1.push(listos.pop())
                    ejecutados_p1.cab.info['estado'] = "ejecucion"
                    cola_hilos.pop().info.start()

            if listos_p2.cab is not None:
                if ejecutados_p2.cab is None:
                    ejecutados_p2.push(listos_p2.pop())
                    ejecutados_p2.cab.info['estado'] = 'ejecucion'
                    cola_hilos_2.pop().info.start()
            
            if listos_p3.cab is not None:
                if ejecutados_p3.cab is None:
                    ejecutados_p3.push(listos_p3.pop())
                    ejecutados_p3.cab.info['estado'] = 'ejecucion'
                    cola_hilos_3.pop().info.start()

            #if cola_hilos.cab is not None:
                #hilo = cola_hilos.pop()
                #hilo.info.start()

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

            proceso = ejecutados_p3.cab
            while proceso is not None:
                respuesta[2].append(proceso.info)
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

            index = terminados_p3.cab
            while index is not None:
                respuesta[2].append(index.info)
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

def actualizarEstado_3(request):
    if request.method == "POST":
        try:
            global ejecutados_p3
            if ejecutados_p3.cab is not None:
                ejecutados_p3.cab.info['estado'] = "suspendido"
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
    else:
        while recurso not in disponibles:
            time.sleep(1)

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
    print "PROCESADOR 1: PROCESO " + proceso + " TERMINADO"
    return


def procesador_2(tiempo, quantum, recurso):
    # RECURSOS
    global disponibles
    global en_uso

    # COLAS
    global ejecutados_p2
    global suspendidos_p2
    global bloqueados_p2
    global terminados_p2
    global listos_p2

    # PROCESO ACTUAL
    proceso = th.current_thread().getName()

    cv = th.Condition()
    if recurso in disponibles:
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso
    else:
        while recurso not in disponibles:
            time.sleep(1)

    evento = th.Event()
    inicio = time.time()
    print "PROCESADOR 2: " + proceso
    fin = 1000000000
    seg = 0
    t_restante = 0
    while seg < tiempo:
        if ejecutados_p2.cab is not None:
            estado = ejecutados_p2.cab.info['estado']
        else:
            estado = 'ejecucion'

        if estado == 'suspendido':
            suspendidos_p2.push(ejecutados_p2.pop())
            suspendidos_p2.cab.info['tiempo'] -= seg
            evento.wait(3)
            print "[PROCESADOR 2] Esperando..."

            quantum = calcularQuantum(listos_p2,suspendidos.cab.info['tiempo'])
            listos_p2.push(suspendidos_p2.pop())
            listos_p2.cab.info['estado'] = 'ejecucion'
            listos.cab.info['quantum'] = quantum

        fin = time.time()
        # print hilo + " " + str(fin - inicio)
        seg = round(fin - inicio)

    terminados_p2.push(ejecutados_p2.pop())
    disponibles.append(en_uso.pop())
    print "PROCESADOR 2: PROCESO " + proceso + " TERMINADO"
    return


def procesador_3(tiempo, quantum, recurso):
     # RECURSOS
    global disponibles
    global en_uso

    # COLAS
    global ejecutados_p3
    global suspendidos_p3
    global bloqueados_p3
    global terminados_p3
    global listos_p3

    # PROCESO ACTUAL
    proceso = th.current_thread().getName()

    if recurso in disponibles:
        print "RECURSO DISBONIBLE, BLOQUEANDO..."
        index = disponibles.index(recurso)
        en_uso.append(disponibles.pop(index))
        print en_uso
    else:
        while recurso not in disponibles:
            time.sleep(1)

    evento = th.Event()
    inicio = time.time()
    print "PROCESADOR 3: " + proceso
    fin = 1000000000
    seg = 0
    t_restante = 0
    while seg < tiempo:
        if ejecutados_p3.cab is not None:
            estado = ejecutados_p3.cab.info['estado']
        else:
            estado = 'ejecucion'

        if estado == 'suspendido':
            suspendidos_p3.push(ejecutados_p3.pop())
            suspendidos_p3.cab.info['tiempo'] -= seg

            print "[PROCESADOR 3] Esperando..."
            evento.wait(3)
            quantum = calcularQuantum(listos_p3,suspendidos.cab.info['tiempo'])
            listos_p3.push(suspendidos_p3.pop())
            listos_p3.cab.info['estado'] = 'ejecucion'
            listos.cab.info['quantum'] = quantum

        fin = time.time()
        seg = round(fin - inicio)

    terminados_p3.push(ejecutados_p3.pop())
    disponibles.append(en_uso.pop())
    print terminados_p3.cab.info
    print "PROCESADOR 3: PROCESO " + proceso + " TERMINADO"
    return
