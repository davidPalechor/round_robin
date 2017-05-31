from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^sjf/$', views.sjf),
    url(r'^sjf/crear_proceso/$', views.sjf),
    url(r'^sjf/lista_listos/', views.listaListos),
    url(r'^sjf/ejecutar/$', views.ejecutarHilos),
    url(r'^sjf/lista_ejecutados/$', views.listarEjecutados),
    url(r'^sjf/recursos/$', views.manejoRecursos),
    url(r'^sjf/lista_terminados/$', views.listarTerminados),
    url(r'^sjf/init/$', views.init)
]