import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RoundrobinService {
  private apiURL = 'http://localhost:8000/round_robin/'
  private urlEjecutarProceso = 'http://localhost:8000/round_robin/ejecutar/'
  private urlGetEjecutados = 'http://localhost:8000/round_robin/lista_ejecutados/'
  private urlRecursos = 'http://localhost:8000/round_robin/recursos/'

  constructor(private http: Http) { }

  getInfoListos() {
    return this.http.get(this.apiURL)
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

  getRecursos(){
    return this.http.get(this.urlRecursos)
    .toPromise()
    .then(response =>response.json())
    .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
