from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^srtf/$', views.srtf),
    url(r'^srtf/crear_proceso/$', views.srtf),
    url(r'^srtf/lista_listos/', views.listaListos),
    url(r'^srtf/ejecutar/$', views.ejecutarHilos),
    url(r'^srtf/lista_ejecutados/$', views.listarEjecutados),
    url(r'^srtf/recursos/$', views.manejoRecursos),
    url(r'^srtf/lista_terminados/$', views.listarTerminados),
    url(r'^srtf/notificar_suspendido/$', views.actualizarEstado),
    url(r'^srtf/notificar_suspendido_2/$', views.actualizarEstado_2),
    url(r'^srtf/notificar_suspendido_3/$', views.actualizarEstado_3),
    url(r'^srtf/init/$', views.init)
]