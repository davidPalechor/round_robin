import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SjfService {
  private apiURL = 'http://localhost:8000/sjf/'
  private urlGetListos = 'http://localhost:8000/sjf/lista_listos/'
  private urlEjecutarProceso = 'http://localhost:8000/sjf/ejecutar/'
  private urlGetEjecutados = 'http://localhost:8000/sjf/lista_ejecutados/'
  private urlRecursos = 'http://localhost:8000/sjf/recursos/'
  private urlGetTerminados = 'http://localhost:8000/sjf/lista_terminados/'
  private urlInit = 'http://localhost:8000/sjf/init/'

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
