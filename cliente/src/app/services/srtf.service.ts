import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SrtfService {
  private apiURL = 'http://localhost:8000/srtf/'
  private urlGetListos = 'http://localhost:8000/srtf/lista_listos/'
  private urlEjecutarProceso = 'http://localhost:8000/srtf/ejecutar/'
  private urlGetEjecutados = 'http://localhost:8000/srtf/lista_ejecutados/'
  private urlRecursos = 'http://localhost:8000/srtf/recursos/'
  private urlGetTerminados = 'http://localhost:8000/srtf/lista_terminados/'
  private urlNotificarSuspendido = 'http://localhost:8000/srtf/notificar_suspendido/'
  private urlNotificarSuspendido_2 = 'http://localhost:8000/srtf/notificar_suspendido_2/'
  private urlNotificarSuspendido_3 = 'http://localhost:8000/srtf/notificar_suspendido_3/'
  private urlInit = 'http://localhost:8000/srtf/init/'

  constructor(private http: Http) { }

  inicializarVariables() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlInit, options)
      .toPromise()
      .then(() => console.log("Ejecutando"))
      .catch(this.handleError);
  }

  getInfoListos() {
    return this.http.get(this.apiURL)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getListaListos() {
    return this.http.get(this.urlGetListos)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getListaTerminados() {
    return this.http.get(this.urlGetTerminados)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  postNotificarSuspendido() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlNotificarSuspendido, options)
      .toPromise()
      .then(() => console.log("[Servicio]:Estado Notificado: suspendido"))
      .catch(this.handleError)
  }

  postNotificarSuspendido_2() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlNotificarSuspendido_2, options)
      .toPromise()
      .then(() => console.log("[Servicio Proc_2]:Estado Notificado: suspendido"))
      .catch(this.handleError)
  }

  postNotificarSuspendido_3() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlNotificarSuspendido_3, options)
      .toPromise()
      .then(() => console.log("[Servicio Proc_3]:Estado Notificado: suspendido"))
      .catch(this.handleError)
  }

  postAgregarProceso(attr: Object): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiURL, attr, options)
      .toPromise()
      .then(res => console.log(res))
      .catch(this.handleError);
  }

  postEjecutarProcesos(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlEjecutarProceso, options)
      .toPromise()
      .then(() => console.log("Ejecutando"))
      .catch(this.handleError);
  }

  getInfoEjecucion() {
    return this.http.get(this.urlGetEjecutados)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  postCrearRecurso(recurso: Object): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlRecursos, recurso, options)
      .toPromise()
      .then(() => console.log("Recurso: success!"))
  }

  getRecursos() {
    return this.http.get(this.urlRecursos)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
