from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^srtf/$', views.srtf),
    url(r'^srtf/crear_proceso/$', views.srtf),
    url(r'^srtf/lista_listos/', views.listaListos),
    url(r'^srtf/ejecutar/$', views.ejecutarHilos),
    url(r'^srtf/lista_ejecutados/$', views.listarEjecutados),
    url(r'^srtf/recursos/$', views.manejoRecursos),
    url(r'^srtf/lista_terminados/$', views.listarTerminados)
]