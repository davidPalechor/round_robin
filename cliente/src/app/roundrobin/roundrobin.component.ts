import { Component, OnInit } from '@angular/core';
import { RoundrobinService } from '../services/roundrobin.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-roundrobin',
  templateUrl: './roundrobin.component.html',
  styleUrls: ['./roundrobin.component.css']
})
export class RoundrobinComponent implements OnInit {
  title = "Round Robin"

  private listos = {}
  private ejecucion = {}
  private bloqueado = {}
  private suspendido = {}
  private terminado = {}
  private cont = 0
  private interval
  private estado
  private items_recursos = {}

  private tiempo_ejecucion = 0
  private cronometro = 0

  private tiempo_simulacion = {
    tiempo:null
  }

  private recurso = {
    value: null
  }

  private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    quantum: 4,
    procesador: 1
  }

  constructor(private roundRobinService: RoundrobinService) { }

  ngOnInit() {
    this.cronometrar()
    this.getInfoListos()
    this.getRecursos();
  }

  getInfoListos() {
    this.roundRobinService.getInfoListos()
      .then(data => {
        this.listos = data
        this.cont = data.length;
      })
  }

  cronometrar(){
    let timer = Observable.timer(1000,1000).subscribe(tiempo => this.cronometro = tiempo);
  }

  tiempo_en_cpu(){
    let timer = Observable.timer(1000,1000).subscribe(tiempo => this.tiempo_ejecucion = tiempo);
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => this.getInfoListos())
  }

  ejecutarProcesos() {
    this.interval = Observable.interval(1000).subscribe(x => {
      this.postEjecutarProcesos()
    });
    //this.interval=setInterval(function(){this.postEjecutar Procesos();},3000);
  }

  postEjecutarProcesos() {
    //this.listarEjecucion()
    this.roundRobinService.postEjecutarProcesos()
      .then(() => {
        console.log("COMPONENTE: EJECUTANDO")
        this.detenerEjecucion()
        this.listarEjecucion()
        this.tiempo_en_cpu()
        this.listarTerminados()
        this.getInfoListos();
      })
  }

  detenerEjecucion() {
    console.log(this.cont);
    // if (this.cont == 1){
    //   console.log("Funciona el IF");
    // }
    if (this.cont == 1) {
      this.estado = 'terminado'
    }
    if (this.estado == 'terminado') {
      this.interval.unsubscribe();
    }
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
        this.ejecucion = data;
      })
  }

  listarSuspendido() {
    this.roundRobinService.getInfoSuspendido()
      .then(data => {
        this.suspendido = data
      })
  }

  listarListos(){
    this.roundRobinService.getListaListos()
    .then(data => {this.listos = data})
  }

  listarTerminados(){
    this.roundRobinService.getListaTerminados()
    .then(data => {this.terminado = data})
  }

  postCrearRecurso() {
    this.roundRobinService.postCrearRecurso(this.recurso)
      .then(() => {
        console.log("Recurso creado")
        this.getRecursos();
      })
  }

  getRecursos() {
    this.roundRobinService.getRecursos()
      .then(data => { this.items_recursos = data
      console.log(data); })
  }
}
