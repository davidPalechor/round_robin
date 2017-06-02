import { Component, OnInit, ViewChild } from '@angular/core';
import { RoundrobinService } from '../services/roundrobin.service';
import { Observable } from 'rxjs/Rx';
import * as jsPDF from 'jspdf';
import * as jquery from 'jquery';

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
  private t_suspendido = 0
  private t_bloqueado = 0
  private t_total = 0
  private t_cpu = 0

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
  private t_suspendido_2 = 0
  private t_bloqueado_2 = 0
  private t_total_2 = 0
  private t_cpu_2 = 0

  //PROCESADOR 3
  private listos_3 = []
  private ejecucion_3 = []
  private bloqueado_3 = []
  private suspendido_3 = []
  private terminado_3 = []
  private total_procesos_3 = []
  private cont_3 = 0
  private timer_3

  private t_bloqueado_3 = 0
  private t_proceso_3 = 0
  private t_quantum_3 = 0
  private tiempo_ejecucion_3 = 0
  private t_total_3 = 0
  private t_cpu_3 = 0

  // OTRAS VARIABLES

  private enEspera_1 = 0
  private enEspera_2 = 0
  private enEspera_3 = 0

  private tiempo_simulacion = 1
  private items_recursos = []

  private enEjecucion = false
  private cronometro = 0

  private recurso = {
    value: null
  }

  private recurso_disponible = []
  private recurso_en_uso = []

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
  private estilo = "#FFFFFF"
  private canvas

  private context_2: CanvasRenderingContext2D
  private estilo_2 = "#FFFFFF"
  private canvas_2

  private context_3: CanvasRenderingContext2D
  private estilo_3 = "#FFFFFF"
  private canvas_3

  constructor(private roundRobinService: RoundrobinService) { }

  // ||-----------------------------OPERACIONES GLOBALES -------------||
  @ViewChild("gant_1") gant_p1
  @ViewChild("gant_2") gant_p2
  @ViewChild("gant_3") gant_p3

  ngOnInit() {
    this.prepararColas()
    // this.getInfoListos()
    // this.getRecursos()
  }

  prepararColas() {
    this.getInfoListos()
    this.getRecursos()
  }

  prepararCanvas() {

    this.t_total = 0
    this.t_total_2 = 0
    this.t_total_3 = 0

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

    if (this.total_procesos_3.length > 0) {
      this.canvas_3 = this.gant_p3.nativeElement
      this.context_3 = this.canvas_3.getContext("2d");
      this.context_3.clearRect(0, 0, this.canvas_3.width, this.canvas_3.height)
    }
  }


  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => {
        this.getInfoListos()
        if (this.param.procesador == 1) {
          this.total_procesos.push(this.param.nombre)
          // this.cont +=1
        }
        if (this.param.procesador == 2) {
          this.total_procesos_2.push(this.param.nombre)
        }

        if (this.param.procesador == 3) {
          this.total_procesos_3.push(this.param.nombre)
        }
      })
  }

  ejecutarProcesos() {
    this.prepararCanvas()
    this.enEjecucion = true
    // this.postEjecutarProcesos()
    if (this.listos.length > 0||this.ejecucion.length>0) {
      this.startProcesador_1()
      this.tiempo_en_proc_1()
    }
    if (this.listos_2.length > 0||this.ejecucion_3.length>0) {
      this.startProcesador_2()
      this.tiempo_en_proc_2()
    }

    if (this.listos_3.length > 0||this.ejecucion_3.length>0) {
      this.startProcesador_3()
      this.tiempo_en_proc_3()
    }
    //this.tiempo_en_proc_2()
  }

  postEjecutarProcesos() {
    this.roundRobinService.postEjecutarProcesos()
  }

  indexRecurso(lista, elemento) {
    let i = 0

    while (elemento != lista[i].recurso) {
      i += 1
      if (i >= lista.length) {
        i = -1;
        break;
      }
    }
    return i;
  }

  pausarSimulacion(){
    this.enEjecucion = false
  }
  
  startProcesador_1() {
    this.t_suspendido = 0;
    this.t_bloqueado = 0
    let timer = setInterval(() => {
      this.t_total+=1;
      if(!this.enEjecucion){
        clearInterval(timer)
      }
      if (this.listos.length == 0 && this.suspendido.length == 0 && this.ejecucion.length == 0) {
        clearInterval(timer);
        // this.p1_enEjecucion = false;
      }
      if (this.ejecucion.length == 0) {
        if (this.cont > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos.shift())
          this.cont -= 1;
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion[0].recurso)
          var bloq;
          if (index > -1) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            console.log(this.recurso_en_uso, bloq)
          } else {
            this.bloqueado.push(this.ejecucion.shift())
            if (this.t_bloqueado == 3) {
              this.t_bloqueado += 1;
              this.listos.push(this.bloqueado.shift())
            }
          }
        }
      } else {
        this.estilo = "#00FF00"
        this.tiempo_ejecucion += 1;
        this.t_cpu +=1;
        if (this.ejecucion[0].tiempo <= this.ejecucion[0].quantum) {
          if (this.tiempo_ejecucion == this.ejecucion[0].tiempo) {
            this.terminado.push(this.ejecucion.shift())
            this.tiempo_ejecucion = 0;
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            console.log(this.recurso_disponible)
          }
        } else {
          if (this.tiempo_ejecucion == this.ejecucion[0].quantum) {
            this.ejecucion[0].tiempo -= this.ejecucion[0].quantum
            this.tiempo_ejecucion = 0
            this.suspendido.push(this.ejecucion.pop())
            this.notificarSuspendido()
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            // this.suspendido.push(this.ejecucion.shift())
          }
        }
      }
    }, 1000 * 1 / this.tiempo_simulacion)
  }


  startProcesador_2() {
    this.t_suspendido_2 = 0;
    this.t_bloqueado_2 = 0
    let timer = setInterval(() => {
      this.t_total_2 += 1;
      if(!this.enEjecucion){
        clearInterval(timer)
      }

      if (this.listos_2.length == 0 && this.suspendido_2.length == 0 && this.ejecucion_2.length == 0) {
        clearInterval(timer);
      }

      if (this.ejecucion_2.length == 0) {
        if (this.cont_2 > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_2.push(this.listos_2.shift())
          this.cont_2 -= 1;
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_2[0].recurso)
          var bloq;
          if (index > -1) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            console.log(this.recurso_en_uso, bloq)
          } else {
            this.bloqueado_2.push(this.ejecucion_2.shift())
            if (this.t_bloqueado_2 == 3) {
              this.t_bloqueado_2 += 1;
              this.listos.push(this.bloqueado.shift())
            }
          }
        }
      } else {
        this.estilo_2 = "#00FF00"
        this.t_cpu_2 += 1
        this.tiempo_ejecucion_2 += 1;
        if (this.ejecucion_2[0].tiempo <= this.ejecucion_2[0].quantum) {
          if (this.tiempo_ejecucion_2 == this.ejecucion_2[0].tiempo) {
            this.terminado_2.push(this.ejecucion_2.shift())
            this.tiempo_ejecucion_2 = 0;
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            console.log(this.recurso_disponible)
          }
        } else {
          if (this.tiempo_ejecucion_2 == this.ejecucion_2[0].quantum) {
            this.ejecucion_2[0].tiempo -= this.ejecucion_2[0].quantum
            this.tiempo_ejecucion_2 = 0
            this.suspendido_2.push(this.ejecucion_2.pop())
            this.notificarSuspendido_2()
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            // this.suspendido.push(this.ejecucion.shift())
          }
        }
      }
    }, 1000 * 1 / this.tiempo_simulacion)
  }


  startProcesador_3() {
    this.t_bloqueado_3 = 0
    let timer = setInterval(() => {
      this.t_total_3 += 1;
      if(!this.enEjecucion){
        clearInterval(timer)
      }

      if (this.listos_3.length == 0 && this.suspendido_3.length == 0 && this.ejecucion_3.length == 0) {
        clearInterval(timer);
      }

      if (this.ejecucion_3.length == 0) {
        if (this.cont_3 > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_3.push(this.listos_3.shift())
          this.cont_3 -= 1;
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_3[0].recurso)
          var bloq;
          if (index > -1) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            console.log(this.recurso_en_uso, bloq)
          } else {
            this.bloqueado_3.push(this.ejecucion_3.shift())
            if (this.t_bloqueado_3 == 3) {
              this.t_bloqueado_3 += 1;
              this.listos.push(this.bloqueado.shift())
            }
          }
        }
      } else {
        this.estilo_3 = "#00FF00"
        this.t_cpu_3 += 1
        this.tiempo_ejecucion_3 += 1;
        if (this.ejecucion_3[0].tiempo <= this.ejecucion_3[0].quantum) {
          if (this.tiempo_ejecucion_3 == this.ejecucion_3[0].tiempo) {
            this.terminado_3.push(this.ejecucion_3.shift())
            this.tiempo_ejecucion_3 = 0;
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            console.log(this.recurso_disponible)
          }
        } else {
          if (this.tiempo_ejecucion_3 == this.ejecucion_3[0].quantum) {
            this.ejecucion_3[0].tiempo -= this.ejecucion_3[0].quantum
            this.tiempo_ejecucion_3 = 0
            this.suspendido_3.push(this.ejecucion_3.pop())
            this.notificarSuspendido_3()
            this.recurso_disponible.push(this.recurso_en_uso.shift())
            // this.suspendido.push(this.ejecucion.shift())
          }
        }
      }
    }, 1000 * 1 / this.tiempo_simulacion)
  }
  //||---------------------------------------- TRAER INFORMACIÓN DE COLAS-------------------||
  getInfoListos() {
    this.roundRobinService.getInfoListos()
      .then(data => {
        console.log("[COLA LISTOS] ", data[0], data[0].tiempo)
        this.listos = data[0]
        this.cont = data[0].length

        console.log("[COLA LISTOS] ", data[1])
        this.listos_2 = data[1]
        this.cont_2 = data[1].length

        console.log("[COLA LISTOS] ", data[2])
        this.listos_3 = data[2]
        this.cont_3 = data[2].length
      })
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
        // this.ejecucion = data[0]

        this.listos.reverse()
        if (this.listos.length > 0) {
          this.ejecucion.push(this.listos.pop())
        }
        console.log("EJECUTANDOSE: ", this.ejecucion)
        if (this.ejecucion.length > 0) {
          this.t_quantum = this.ejecucion[0].quantum
          this.t_proceso = this.ejecucion[0].tiempo
        }

        this.listos_2.reverse()
        if (this.listos_2.length > 0) {
          this.ejecucion_2.push(this.listos_2.pop())
        }
        console.log("EJECUTANDOSE: ", this.ejecucion)
        if (this.ejecucion_2.length > 0) {
          this.t_quantum_2 = this.ejecucion_2[0].quantum
          this.t_proceso_2 = this.ejecucion_2[0].tiempo
        }
      })
  }

  listarSuspendido() {
    this.roundRobinService.getInfoSuspendido()
      .then(data => {
        this.suspendido = data[0]
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
        this.terminado_3 = data[2]
      })
  }

  postCrearRecurso() {
    this.roundRobinService.postCrearRecurso(this.recurso)
      .then(() => {
        console.log("Recurso creado")
        this.getRecursos();
        // this.recurso_disponible.push(this.recurso.value)
      })
  }

  getRecursos() {
    this.roundRobinService.getRecursos()
      .then(data => {
        this.items_recursos = data
        this.recurso_disponible = data
      })
  }

  // ||---------------------------------------OPERACIONES------------------------||
  // ||---------------------------------------PROCESADOR 1 ----------------------||


  tiempo_en_suspendidos() {

    this.estilo = "#FF9E4A"
    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        let quantum = this.calcularQuantum(this.listos, this.suspendido[0].tiempo)

        this.listos.push(this.suspendido.pop())
        this.listos[0].quantum = quantum;
        console.log(this.listos)
        this.cont += 1;
      }
      if (tiempo == 6) {
        this.estilo == "#00FF00"
        timer.unsubscribe()
      }

    })
  }

  tiempo_en_proc_1() {

    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      this.context.fillStyle = this.estilo
      this.context.fillRect(this.t_total * 2, 0, 2, 20)
      if(!this.enEjecucion){
        timer.unsubscribe()
      }
      if (this.listos.length == 0 && this.suspendido.length == 0 && this.ejecucion.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  notificarSuspendido() {
    this.roundRobinService.postNotificarSuspendido()
      .then(() => {
        // this.listarSuspendido()
        this.tiempo_en_suspendidos()
      })
  }
  // ||--------------------------------------------------------------------------------------||
  // ||------------------------------------------PROCESADOR 2--------------------------------||
  // ||--------------------------------------------------------------------------------------||

  tiempo_en_proc_2() {

    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      this.context_2.fillStyle = this.estilo_2
      this.context_2.fillRect(this.t_cpu_2 * 2, 0, 2, 20)
      if(!this.enEjecucion){
        timer.unsubscribe()
      }
      if (this.listos_2.length == 0 && this.suspendido_2.length == 0 && this.ejecucion_2.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  tiempo_en_suspendidos_2() {

    this.estilo_2 = "#0000FF"
    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        let quantum = this.calcularQuantum(this.listos_2, this.suspendido_2[0].tiempo)
        this.listos_2.push(this.suspendido_2.pop())
        this.listos_2[0].quantum = quantum;
        this.cont_2 += 1;
      }
      if (tiempo == 6) {
        this.estilo == "#00FF00"
        timer.unsubscribe()
      }

    })
  }

  notificarSuspendido_2() {
    this.roundRobinService.postNotificarSuspendido_2()
      .then(() => {
        this.tiempo_en_suspendidos_2()
      })
  }

// |----------------------------------------------PROCESADOR 3----------------------------||
tiempo_en_proc_3() {

    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      this.context_3.fillStyle = this.estilo_3
      this.context_3.fillRect(this.t_cpu_3 * 2, 0, 2, 20)
      if(!this.enEjecucion){
        timer.unsubscribe()
      }
      if (this.listos_3.length == 0 && this.suspendido_3.length == 0 && this.ejecucion_3.length == 0) {
        timer.unsubscribe()
      }
    })
  }

  tiempo_en_suspendidos_3() {

    this.estilo_3 = "#0000FF"
    let timer = Observable.timer(0, 1000*1/this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        let quantum = this.calcularQuantum(this.listos_3, this.suspendido_3[0].tiempo)
        this.listos_3.push(this.suspendido_3.pop())
        this.listos_3[0].quantum = quantum;
        this.cont_3 += 1;
      }
      if (tiempo == 6) {
        this.estilo == "#00FF00"
        timer.unsubscribe()
      }

    })
  }

  notificarSuspendido_3() {
    this.roundRobinService.postNotificarSuspendido_3()
      .then(() => {
        this.tiempo_en_suspendidos_3()
      })
  }
  // ||---------------------------------------OTRAS OPERACIONES----------------------------||

  calcularQuantum(cola, tiempo: number) {
    let quantum = 0
    let num = 0
    if (cola.length == 0) {
      quantum = tiempo
    } else {
      for (let item of cola) {
        quantum += cola.tiempo;
        num += 1;
      }
      quantum = Math.round(quantum / num)
      if (tiempo >= quantum) {
        quantum = Math.ceil(quantum * 2 / 3);
      } else {
        quantum = Math.ceil(tiempo * 2 / 3);
      }
    }
    return quantum;
  }
  generarPDF() {

    //VARIABLES MEDIDAS: PROCESADOR 1 
    let prom_procesador = this.t_total / this.total_procesos.length;
    let prom_cpu = this.t_cpu / this.total_procesos.length;
    let rendimiento = prom_cpu / prom_procesador;

    //VARIABLES MEDIDAS: PROCESADOR 2
    let prom_procesador_2 = this.t_total_2 / this.total_procesos_2.length;
    let prom_cpu_2 = this.t_cpu_2 / this.total_procesos_2.length;
    let rendimiento_2 = prom_cpu_2 / prom_procesador_2;

    //VARIABLES MEDIDAS: PROCESADOR 3
    let prom_procesador_3 = this.t_total_3 / this.total_procesos_3.length;
    let prom_cpu_3 = this.t_cpu_3 / this.total_procesos_3.length;
    let rendimiento_3 = prom_cpu_3 / prom_procesador_3;

    var document = new jsPDF();
    // TITULO

    document.setTextColor(105, 156, 175)
    document.setFontSize(20)
    document.text("ALGORITMO DE PLANIFICACIÓN ROUND ROBIN", 20, 20)

    //CUERPO
    document.setFontSize(16);
    document.text('PROCESADOR 1', 20, 30);

    document.setTextColor(0, 0, 0)
    document.setFontSize(12);
    document.text("Sumatoria de tiempos en procesador: " + this.t_total.toString() + " segundos", 20, 40)
    document.text("Sumatoria de tiempos en sección crítica: " + this.t_cpu.toString() + " segundos", 20, 50)
    document.text(20, 60, "Promedio de tiempos en procesador: " + prom_procesador.toString() + " segundos")
    document.text(20, 70, "Promedio de tiempos en sección crítica: " + prom_cpu.toString() + " segundos")
    document.text("Rendimiento: " + rendimiento * 100 + "%", 20, 80)
    document.text("Total procesos: " + this.total_procesos.length.toString(), 20, 90)

    document.setFontSize(16);
    document.setTextColor(105, 156, 175)
    document.text('PROCESADOR 2', 20, 100);

    document.setTextColor(0, 0, 0)
    document.setFontSize(12);
    document.text("Tiempo en procesador: " + this.t_total_2.toString() + " segundos", 20, 110)
    document.text("Sumatoria de tiempos en sección crítica: " + this.t_cpu_2.toString() + " segundos", 20, 120)
    document.text(20, 130, "Promedio de tiempos en procesador: " + this.t_total_2.toString() + " segundos")
    document.text("Rendimiento: " + rendimiento_2 * 100 + "%", 20, 140)
    document.text("Total procesos: " + this.total_procesos_2.length.toString(), 20, 150)

    document.setFontSize(16);
    document.setTextColor(105, 156, 175)
    document.text('PROCESADOR 3', 20, 160);

    document.setTextColor(0, 0, 0)
    document.setFontSize(12);
    document.text("Tiempo en procesador: " + this.t_total_3.toString() + " segundos", 20, 170)
    document.text("Sumatoria de tiempos en sección crítica: " + this.t_cpu_3.toString() + " segundos", 20, 180)
    document.text(20, 190, "Promedio de tiempos en procesador: " + this.t_total_3.toString() + " segundos")
    document.text("Rendimiento: " + rendimiento_3 * 100 + "%", 20, 200)
    document.text("Total procesos: " + this.total_procesos_3.length.toString(), 20, 210)

    //ARCHIVO
    document.save('metricas.pdf')
  }
}
