from django.shortcuts import render
import threading as th

def round_robin(request):
	threads = list()
	salida = list()
	for i in range(3):
	    t = th.Thread(target=proceso, args=(i,))
	    print i
	    threads.append(t)
	    salida.append('Hilo ' + str(i))
	    t.start()
	return render(request, "round_robin.html",{'out':salida});

def fifo(request):
	return render(request, "fifo.html",{'out':'FIFO'})
# Create your views here.

def proceso(cont):
	print "Este es el %s trabajo que hago hoy para Genbeta Dev" % cont
	return