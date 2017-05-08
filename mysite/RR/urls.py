from django.conf.urls import include, url
from . import views


urlpatterns = [
    url(r'^round_robin/$', views.round_robin),
    url(r'^fifo', views.fifo),
    url(r'^round_robin/ejecutar/$', views.ejecutarHilos),
    url(r'^round_robin/lista_ejecutados/$', views.listarEjecutados),
    url(r'^round_robin/recursos/$', views.manejoRecursos)
]
