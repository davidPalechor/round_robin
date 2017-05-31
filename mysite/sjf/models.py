from __future__ import unicode_literals

from django.db import models


class Nodo():
    def __init__(self):
        self.info = []
        self.sig = None


class Cola():
    def __init__(self):
        self.cab = None

    def push(self, item):
        if self.cab is None:
            self.cab = item
        else:
            raiz = self.cab
            while raiz.sig is not None:
                raiz = raiz.sig
            raiz.sig = item

    def pop(self):
        if self.cab is None:
            return None
        else:
            item = self.cab
            self.cab = self.cab.sig
            item.sig = None
            return item

    def isVacia(self):
        if self.cab is None:
            return True
        else:
            return False
