import { Component, OnInit } from '@angular/core';
import { RoundrobinService } from '../services/roundrobin.service';

@Component({
  selector: 'app-roundrobin',
  templateUrl: './roundrobin.component.html',
  styleUrls: ['./roundrobin.component.css']
})
export class RoundrobinComponent implements OnInit {
  title = "Round Robin"
  private infoHilo = {}
  private listos = {}
  private ejecucion = {}
  private bloqueado = {}
  private suspendido = {}

  private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    prior: null
  }

  constructor(private roundRobinService: RoundrobinService) { }

  ngOnInit() {
    this.getInfoListos();
  }

  getInfoListos() {
    this.roundRobinService
      .getInfoListos()
      .then(data => {
        this.infoHilo = data;
      })
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => this.getInfoListos())
  }

  postEjecutarProcesos() {
    //this.listarEjecucion()
    this.roundRobinService.postEjecutarProcesos()
      .then(() => this.listarEjecucion())
    this.getInfoListos()
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
      this.ejecucion = data;
      })//this.ejecucion = this.infoHilo;
  }
}
