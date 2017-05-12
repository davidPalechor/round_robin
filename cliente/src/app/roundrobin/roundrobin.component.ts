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

  private t_proceso = 0
  private t_quantum = 0

  private listos = []
  private ejecucion = []
  private bloqueado = []
  private suspendido = []
  private terminado = []
  private cont = 0
  private interval
  private timer
  private estado
  private items_recursos = []

  private tiempo_ejecucion = 0
  private cronometro = 0

  private tiempo_simulacion = {
    tiempo: null
  }

  private recurso = {
    value: null
  }

  private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    quantum: 0,
    procesador: 1,
    estado: 'ejecucion'
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
        this.cont = data.length
      })
  }

  calcularQuantum() {
    let quantum = 0
    if (this.cont == 0) {
      this.param.quantum = this.param.tiempo
    } else {
      for (let item of this.listos) {
        quantum += item.tiempo
      }
      quantum = Math.round(quantum / this.cont)
      if (this.param.tiempo >= quantum) {
        this.param.quantum = Math.ceil(quantum * (2 / 3))
      } else {
        this.param.quantum = quantum
      }
    }
  }

  cronometrar() {
    let timer = Observable.timer(1000, 1000).subscribe(tiempo => this.cronometro = tiempo);
  }

  tiempo_en_cpu() {
    this.timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      this.tiempo_ejecucion = tiempo
      if (this.t_proceso <= this.t_quantum) {
        if (this.tiempo_ejecucion == this.t_proceso) {
          this.detenerEjecucion()
        }
      }
      else if (this.tiempo_ejecucion == this.t_quantum) {
        console.log("COMPONENTE: listando suspendidos")
        this.notificarSuspendido()
      }
    });
  }

  tiempo_en_suspendidos() {
    let timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        this.getInfoListos()
        this.listarSuspendido()
      }
      if (tiempo == 6) {
        timer.unsubscribe()
        this.ejecutarProcesos()
      }

    })
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => this.getInfoListos())
  }

  ejecutarProcesos() {
    this.postEjecutarProcesos()
  }

  postEjecutarProcesos() {
    //this.listarEjecucion()
    this.roundRobinService.postEjecutarProcesos()
      .then(() => {
        this.listarEjecucion()
        this.tiempo_en_cpu()
        this.getInfoListos();
      })
  }

  detenerEjecucion() {
    console.log("Numero de procesos en cola %i", this.cont);
    if (this.cont >= 1) {
      this.listarTerminados()
      this.ejecutarProcesos()
      this.timer.unsubscribe()
    } else {
      this.timer.unsubscribe()
      this.listarTerminados()
      this.listarEjecucion()
      console.log("Proceso Terminado")
    }
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
        this.ejecucion = data
        if (data.length > 0) {
          this.t_quantum = data[0].quantum
          this.t_proceso = data[0].tiempo
        }
      })
  }

  listarSuspendido() {
    this.roundRobinService.getInfoSuspendido()
      .then(data => {
        this.suspendido = data
        this.timer.unsubscribe()
      })
  }

  notificarSuspendido() {
    this.roundRobinService.postNotificarSuspendido()
      .then(() => {
        this.listarSuspendido()
        this.tiempo_en_suspendidos()
      })
  }

  listarListos() {
    this.roundRobinService.getListaListos()
      .then(data => { this.listos = data })
  }

  listarTerminados() {
    this.roundRobinService.getListaTerminados()
      .then(data => { this.terminado = data })
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
      .then(data => {
        this.items_recursos = data
        console.log(data);
      })
  }
}
