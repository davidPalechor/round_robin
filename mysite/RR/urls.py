from django.conf.urls import include, url
from . import views


urlpatterns = [
    url(r'^round_robin/$', views.round_robin),
    url(r'^round_robin/crear_proceso/$', views.round_robin),
    url(r'^round_robin/lista_listos/', views.listaListos),
    url(r'^round_robin/ejecutar/$', views.ejecutarHilos),
    url(r'^round_robin/lista_ejecutados/$', views.listarEjecutados),
    url(r'^round_robin/recursos/$', views.manejoRecursos),
    url(r'^round_robin/lista_terminados/$', views.listarTerminados),
    url(r'^round_robin/lista_suspendidos/$', views.listarSuspendidos),
    url(r'^round_robin/notificar_suspendido/$', views.actualizarEstado),
    url(r'^round_robin/notificar_suspendido_2/$', views.actualizarEstado_2),
    url(r'^round_robin/notificar_suspendido_3/$', views.actualizarEstado_3)
    #url(r'^round_robin/lista_suspendidos/$', views.listarSuspendidos)
]
