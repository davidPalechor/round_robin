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


  // Procesador 1
  private listos = []
  private ejecucion = []
  private bloqueado = []
  private suspendido = []
  private terminado = []
  private total_procesos = []
  private cont = 0
  private timer

  private t_proceso = 0
  private t_quantum = 0
  private tiempo_ejecucion = 0

  //PROCESADOR 2
  private listos_2 = []
  private ejecucion_2 = []
  private bloqueado_2 = []
  private suspendido_2 = []
  private terminado_2 = []
  private total_procesos_2 = []
  private cont_2 = 0
  private timer_2

  private t_proceso_2 = 0
  private t_quantum_2 = 0
  private tiempo_ejecucion_2 = 0

  private items_recursos = []

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

  private context_2: CanvasRenderingContext2D
  private estilo_2 = "#000000"
  private canvas_2


  constructor(private roundRobinService: RoundrobinService) { }


  @ViewChild("gant_1") gant_p1
  @ViewChild("gant_2") gant_p2
  @ViewChild("gant_3") gant_p3

  ngOnInit() {
    this.getInfoListos()
    this.getRecursos()
  }

  prepararCanvas() {
    if (this.total_procesos.length > 0) {
      this.canvas = this.gant_p1.nativeElement
      this.context = this.canvas.getContext("2d");
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    if (this.total_procesos_2.length > 0) {
      this.canvas_2 = this.gant_p2.nativeElement
      this.context_2 = this.canvas_2.getContext("2d");
      this.context_2.clearRect(0, 0, this.canvas_2.width, this.canvas_2.height)
    }
  }
  getInfoListos() {
    this.roundRobinService.getInfoListos()
      .then(data => {
        this.listos = data[0]
        this.cont = data[0].length

        this.listos_2 = data[1]
        this.cont_2 = data[1].length
      })
  }

  cronometrar() {
    let timer = Observable.timer(1000, 1000).subscribe(tiempo => this.cronometro = tiempo);
  }

  tiempo_en_cpu_1() {
    this.estilo = "#00FF00"
    this.timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      this.tiempo_ejecucion = tiempo
      if (this.t_proceso <= this.t_quantum) {
        if (this.tiempo_ejecucion == this.t_proceso) {
          console.log("Terminando ejecucion")
          this.detenerEjecucion()
        }
      }
      else if (this.tiempo_ejecucion == this.t_quantum) {
        console.log("COMPONENTE: listando suspendidos")
        this.notificarSuspendido()
      }
    });
  }

  tiempo_en_cpu_2() {
    this.estilo_2 = "#00FF00"
    this.timer_2 = Observable.timer(1000, 1000).subscribe(tiempo => {
      this.tiempo_ejecucion_2 = tiempo
      if (this.t_proceso_2 <= this.t_quantum_2) {
        if (this.tiempo_ejecucion_2 == this.t_proceso_2) {
          console.log("PROCESADOR 2: Terminando ejecucion")
          this.detenerEjecucion_2()
        }
      }
      else if (this.tiempo_ejecucion_2 == this.t_quantum_2) {
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
        this.listarEjecucion()
      }
      if (tiempo == 6) {
        timer.unsubscribe()
        this.postEjecutarProcesos()
      }

    })
  }

  tiempo_en_proc_1() {

    let timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      tiempo += 1
      this.context.fillStyle = this.estilo
      this.context.fillRect(tiempo * 2, 0, 2, 20)
      if (this.listos.length == 0 && this.suspendido.length == 0 && this.ejecucion.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  tiempo_en_proc_2() {

    let timer = Observable.timer(1000, 1000).subscribe(tiempo => {
      tiempo += 1
      this.context_2.fillStyle = this.estilo_2
      this.context_2.fillRect(tiempo * 2, 0, 2, 20)
      if (this.listos_2.length == 0 && this.suspendido_2.length == 0 && this.ejecucion_2.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => {
        this.getInfoListos()
        if (this.param.procesador == 1) {
          this.total_procesos.push(this.param.nombre)
        }
        if (this.param.procesador == 2) {
          this.total_procesos_2.push(this.param.nombre)
        }
      })
  }

  ejecutarProcesos() {
    this.prepararCanvas()
    this.postEjecutarProcesos()
    if (this.listos.length > 0) {
      this.tiempo_en_proc_1()
    }
    if (this.listos_2.length > 0) {
      this.tiempo_en_proc_2()
    }
    //this.tiempo_en_proc_2()
  }

  postEjecutarProcesos() {
    //this.listarEjecucion()
    this.roundRobinService.postEjecutarProcesos()
      .then(() => {
        this.listarEjecucion()
        if (this.cont > 0) {
          this.tiempo_en_cpu_1()
        }
        if (this.cont_2 > 0) {
          this.tiempo_en_cpu_2()
        }
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

  detenerEjecucion_2() {
    console.log("Numero de procesos en cola %i", this.cont);
    if (this.cont_2 >= 1) {
      this.listarTerminados()
      this.postEjecutarProcesos()
      this.timer_2.unsubscribe()
    } else {
      this.timer_2.unsubscribe()
      this.listarTerminados()
      this.listarEjecucion()
      console.log("Proceso Terminado")
    }
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
        console.log(data[1])
        this.ejecucion = data[0]
        if (data[0].length > 0) {
          this.t_quantum = data[0][0].quantum
          console.log(this.t_quantum)
          this.t_proceso = data[0][0].tiempo
        }
        this.ejecucion_2 = data[1]
        if (data[1].length > 0){
          this.t_quantum_2 = data[1][0].quantum
          console.log(this.t_quantum)
          this.t_proceso_2 = data[1][0].tiempo
        }
      })
  }

  listarSuspendido() {
    this.roundRobinService.getInfoSuspendido()
      .then(data => {
        this.suspendido = data[0]
        this.suspendido_2 = data[1]
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
      .then(data => {
        this.terminado = data[0]
        this.terminado_2 = data[1]
      })
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
