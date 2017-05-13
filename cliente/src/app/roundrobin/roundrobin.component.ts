import { Component, OnInit, ViewChild } from '@angular/core';
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
  private total_procesos = []
  private cont = 0
  private timer
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
  // Propiedades del canvas
  private context: CanvasRenderingContext2D
  private estilo = "#000000"
  private canvas


  constructor(private roundRobinService: RoundrobinService) { }


  @ViewChild("gant_1") gant_p1

  ngOnInit() {
    this.cronometrar()
    this.getInfoListos()
    this.getRecursos()
  }

  prepararCanvas() {
    if (this.total_procesos.length > 0) {
      this.canvas = this.gant_p1.nativeElement
      this.context = this.canvas.getContext("2d");
    }
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
    this.estilo = "#00FF00"
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
    this.estilo = "#0000FF"
    let timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        this.getInfoListos()
        this.listarSuspendido()
      }
      if (tiempo == 6) {
        timer.unsubscribe()
        this.postEjecutarProcesos()
      }

    })
  }

  tiempo_en_sistema() {

    let timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      tiempo += 1
      this.context.fillStyle = this.estilo
      this.context.fillRect(tiempo, 0, 1, 20)
      if (this.listos.length == 0 && this.suspendido.length == 0 && this.ejecucion.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => {
        this.getInfoListos()
        this.total_procesos.push(this.param.nombre)
      })
  }

  ejecutarProcesos() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.postEjecutarProcesos()
    this.prepararCanvas()
    this.tiempo_en_sistema()
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
      this.postEjecutarProcesos()
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
