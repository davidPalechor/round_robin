from django.conf.urls import include, url
from . import views


urlpatterns = [
        url(r'^$', views.index),
        url(r'round_robin', views.round_robin),
        url(r'fifo', views.fifo),
    ]