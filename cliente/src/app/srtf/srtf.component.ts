import { Component, OnInit, ViewChild } from '@angular/core';
import { SrtfService } from '../services/srtf.service';
import { Observable } from 'rxjs/Rx';
import * as jsPDF from 'jspdf';
import * as jquery from 'jquery';

@Component({
  selector: 'app-srtf',
  templateUrl: './srtf.component.html',
  styleUrls: ['./srtf.component.css']
})
export class SrtfComponent implements OnInit {
  title = "Shortest Remaining Time First SRTF"


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
  private t_bloqueado = 0
  private t_suspendido = 3
  private t_total = 0
  private t_cpu = 0

  //PROCESADOR 2
  private listos_2 = []
  private ejecucion_2 = []
  private bloqueado_2 = []
  private suspendido_2 = []
  private terminado_2 = []
  private t_suspendido_2 = 3
  private total_procesos_2 = []
  private cont_2 = 0
  private timer_2

  private t_proceso_2 = 0
  private tiempo_ejecucion_2 = 0
  private t_bloqueado_2 = 0
  private t_total_2 = 0
  private t_cpu_2 = 0

  //PROCESADOR 3
  private listos_3 = []
  private ejecucion_3 = []
  private bloqueado_3 = []
  private terminado_3 = []
  private suspendido_3 = []
  private total_procesos_3 = []
  private cont_3 = 0
  private timer_3

  private t_bloqueado_3 = 0
  private t_suspendido_3 = 3
  private t_proceso_3 = 0
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

  constructor(private srtfService: SrtfService) { }

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
    //this.inicializarVariables()
    this.getInfoListos()
    this.getRecursos()
    // this.listarEjecucion()
    //this.listarTerminados()
  }

  prepararCanvas() {
    this.t_total = 0
    this.t_total_2 = 0
    this.t_total_3 = 0

    this.canvas = this.gant_p1.nativeElement
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.canvas_2 = this.gant_p2.nativeElement
    this.context_2 = this.canvas_2.getContext("2d");
    this.context_2.clearRect(0, 0, this.canvas_2.width, this.canvas_2.height)


    this.canvas_3 = this.gant_p3.nativeElement
    this.context_3 = this.canvas_3.getContext("2d");
    this.context_3.clearRect(0, 0, this.canvas_3.width, this.canvas_3.height)

  }


  postAgregarProceso() {
    this.srtfService.postAgregarProceso(this.param)
      .then(() => {
        

        if(!this.enEjecucion){
          this.getInfoListos()
        }else{
          var info = jquery.extend({},this.param)
          console.log(info)
          if (this.param.procesador == 1) {
            this.listos.push(info)
            // this.cont +=1
          }
        if (this.param.procesador == 2) {
          this.listos_2.push(info)
        }

        if (this.param.procesador == 3) {
          this.listos_3.push(info)
        }
        }
        if (this.param.procesador == 1) {
            //this.listos.push(this.param)
            this.total_procesos.push(this.param.nombre)
            // this.cont +=1
          }
        if (this.param.procesador == 2) {
          //this.listos_2.push(this.param)
          this.total_procesos_2.push(this.param.nombre)
        }

        if (this.param.procesador == 3) {
          //this.listos_3.push(this.param)
          this.total_procesos_3.push(this.param.nombre)
        }
      })
  }

  inicializarVariables() {
    this.t_total = 0
    this.t_total_2 = 0
    this.t_total_3 = 0
    this.t_cpu = 0
    this.t_cpu_2 = 0
    this.t_cpu_3 = 0
    this.srtfService.inicializarVariables()
  }

  ejecutarProcesos() {
    this.inicializarVariables()
    this.prepararCanvas()
    this.terminarEjecucion()
    this.enEjecucion = true
    // this.postEjecutarProcesos()
    this.startProcesador_1()
    this.tiempo_en_proc_1()

    this.startProcesador_2()
    this.tiempo_en_proc_2()


    this.startProcesador_3()
    this.tiempo_en_proc_3()

    //this.tiempo_en_proc_2()
  }

  postEjecutarProcesos() {
    this.srtfService.postEjecutarProcesos()
  }

  indexBloqueado(lista, elemento) {
    let i = 0
    if (lista.length == 0) {
      return -1
    }
    while (elemento != lista[i]) {
      i += 1
      if (i > lista.length) {
        i -= 1
        break;
      }
    }
    return i
  }

  indexRecurso(lista, elemento) {
    let i = 0
    if (lista.length == 0) {
      return -1;
    }
    while (elemento != lista[i].recurso) {
      i += 1
      if (i >= lista.length) {
        i = -1;
        break;
      }
    }
    return i;
  }

  terminarEjecucion() {

    let timer = setInterval(() => {
      if (this.listos.length == 0 &&
        this.listos_2.length == 0 &&
        this.listos_3.length == 0 &&
        this.bloqueado.length == 0 &&
        this.bloqueado_2.length == 0 &&
        this.bloqueado_3.length == 0 &&
        this.ejecucion.length == 0 &&
        this.ejecucion_2.length == 0 &&
        this.ejecucion_3.length == 0) {
        console.log("Terminando")
        this.enEjecucion = false
        this.srtfService.inicializarVariables()
        clearInterval(timer)
      }
    }, 1000)
  }

  ordenarCola(lista) {
    var vec = lista;
    var aux, p, j, t;
    for (var i = 1; i < lista.length; i++) {
      aux = lista[i];
      t = lista[i].tiempo;
      j = i - 1;
      while (j >= 0 && t < lista[j].tiempo) {
        lista[j + 1] = lista[j];
        j--;
      }
      lista[j + 1] = aux;
    }
    return lista
  }

  startProcesador_1() {
    this.t_bloqueado = 0
    if (this.enEjecucion) {
      this.listos = this.ordenarCola(this.listos);

      if (this.ejecucion.length == 0) {
        if (this.listos.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos.shift())
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion[0].recurso)
          var bloq;
          if (index > -1 && this.enEspera_2 == 0) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            this.t_total += 1
          } else {
            this.estilo = "#FF0000"
            this.bloqueado.push(this.ejecucion.shift())
            this.enEspera_1 = 1
            this.t_bloqueado += 1;
          }
        }
        if (this.bloqueado.length > 0) {
          for (let i = 0; i < this.bloqueado.length; i++) {
            index = this.indexRecurso(this.recurso_disponible, this.bloqueado[i].recurso)
            var aux = this.indexBloqueado(this.bloqueado, this.bloqueado[i]);
            if (index > -1) {
              this.listos.push(this.bloqueado.splice(aux, 1)[0])
            }
          }
          this.t_bloqueado += 1;
          this.t_total += 1;
        }
      } else {
        this.estilo = "#00FF00"
        this.tiempo_ejecucion += 1;
        this.t_cpu += 1;
        this.t_total += 1;
        this.ejecucion[0].tiempo -= 1
        if (this.listos.length > 0) {
          if (this.ejecucion[0].tiempo > this.listos[0].tiempo) {
            this.suspendido.push(this.ejecucion.pop())
            this.notificarSuspendido()
            this.ejecucion.push(this.listos.shift())
          }
        }
        if (this.ejecucion[0].tiempo == 0) {
          this.terminado.push(this.ejecucion.shift())
          this.tiempo_ejecucion = 0;
          this.recurso_disponible.push(this.recurso_en_uso.shift())
          console.log("[PROC 1] Recurso Liberado ", this.recurso_disponible)

        }
      }

      setTimeout(() => this.startProcesador_1(), 1000 * 1 / this.tiempo_simulacion)
    }
  }



  startProcesador_2() {
    this.t_bloqueado_2 = 0
    if (this.enEjecucion) {

      this.listos_2 = this.ordenarCola(this.listos_2);

      if (this.ejecucion_2.length == 0) {
        if (this.listos_2.length > 0) {

          this.postEjecutarProcesos()
          this.ejecucion_2.push(this.listos_2.shift())
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_2[0].recurso)
          var bloq;
          if (index > -1) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            this.t_total_2 += 1;
            this.enEspera_2 = 0
          } else {
            this.estilo_2 = "#FF0000"
            this.bloqueado_2.push(this.ejecucion_2.shift())
            this.enEspera_2 = 1;
          }
        }
        if (this.bloqueado_2.length > 0) {
          for (let i = 0; i < this.bloqueado_2.length; i++) {
            index = this.indexRecurso(this.recurso_disponible, this.bloqueado_2[i].recurso)
            var aux = this.indexBloqueado(this.bloqueado_2, this.bloqueado_2[i]);
            if (index > -1) {
              this.listos_2.push(this.bloqueado_2.splice(aux, 1)[0])
            }
          }
          this.t_bloqueado_2 += 1;
          this.t_total_2 += 1;
        }
      } else {
        this.t_total_2 += 1;
        this.estilo_2 = "#00FF00"
        this.tiempo_ejecucion_2 += 1;
        this.t_cpu_2 += 1;
        this.ejecucion_2[0].tiempo -= 1;
        if (this.listos_2.length > 0) {
          if (this.ejecucion_2[0].tiempo > this.listos_2[0].tiempo) {
            this.suspendido_2.push(this.ejecucion_2.pop())
            this.notificarSuspendido_2()
            this.ejecucion_2.push(this.listos_2.shift())
          }
        }
        if (this.ejecucion_2[0].tiempo == 0) {
          this.terminado_2.push(this.ejecucion_2.shift())
          this.tiempo_ejecucion_2 = 0;
          this.recurso_disponible.push(this.recurso_en_uso.shift())
          console.log("[PROC 2] Recurso Liberado ", this.recurso_disponible)
        }
      }

      setTimeout(() => this.startProcesador_2(), 1000 * 1 / this.tiempo_simulacion)
    }
  }


  startProcesador_3() {
    this.t_bloqueado_3 = 0
    if (this.enEjecucion) {
      this.listos_3 = this.ordenarCola(this.listos_3);

      if (this.ejecucion_3.length == 0) {
        if (this.listos_3.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_3.push(this.listos_3.shift())
          var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_3[0].recurso)
          var bloq;
          if (index > -1) {
            bloq = this.recurso_disponible.splice(index, 1)[0]; //Probar si el recurso está disponible
            this.recurso_en_uso.push(bloq);
            this.t_total_3 += 1;
          } else {
            this.estilo_3 = "#FF0000"
            this.bloqueado_3.push(this.ejecucion_3.shift())
            this.t_bloqueado_3 += 1;
          }
        }
        if (this.bloqueado_3.length > 0) {
          for (let i = 0; i < this.bloqueado_3.length; i++) {
            index = this.indexRecurso(this.recurso_disponible, this.bloqueado_3[i].recurso)
            var aux = this.indexBloqueado(this.bloqueado_3, this.bloqueado_3[i]);
            if (index > -1) {
              this.listos_3.push(this.bloqueado_3.splice(aux, 1)[0])
            }
          }
          this.t_bloqueado_3 += 1;
          this.t_total_3 += 1;
        }
      } else {
        this.t_total_3 += 1;
        this.estilo_3 = "#00FF00"
        this.tiempo_ejecucion_3 += 1;
        this.t_cpu_3 += 1;
        this.ejecucion_3[0].tiempo -= 1
        if (this.listos_3.length > 0) {
          if (this.ejecucion_3[0].tiempo > this.listos_3[0].tiempo) {
            this.suspendido_3.push(this.ejecucion_3.pop())
            this.notificarSuspendido_3()
            this.ejecucion_3.push(this.listos_3.shift())
          }
        }
        if (this.ejecucion_3[0].tiempo == 0) {
          this.terminado_3.push(this.ejecucion_3.shift())
          this.tiempo_ejecucion_3 = 0;
          this.recurso_disponible.push(this.recurso_en_uso.shift())
          console.log("[PROC 3] Recurso Liberado ", this.recurso_disponible)
        }
      }

      setTimeout(() => this.startProcesador_3(), 1000 * 1 / this.tiempo_simulacion)
    }
  }
  //||---------------------------------------- TRAER INFORMACIÓN DE COLAS-------------------||
  getInfoListos() {
    this.srtfService.getInfoListos()
      .then(data => {
        console.log("[COLA LISTOS] ", data[0])
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



  listarListos() {
    this.srtfService.getListaListos()
      .then(data => { this.listos = data })
  }

  listarTerminados() {
    this.srtfService.getListaTerminados()
      .then(data => {
        this.terminado = data[0]
        this.terminado_2 = data[1]
        this.terminado_3 = data[2]
      })
  }

  postCrearRecurso() {
    this.srtfService.postCrearRecurso(this.recurso)
      .then(() => {
        console.log("Recurso creado")
        this.getRecursos();
        // this.recurso_disponible.push(this.recurso.value)
      })
  }

  getRecursos() {
    this.srtfService.getRecursos()
      .then(data => {
        this.items_recursos = data;
        this.recurso_disponible = this.items_recursos.slice(0);
      })
  }

  // ||---------------------------------------OPERACIONES------------------------||
  // ||---------------------------------------PROCESADOR 1 ----------------------||



  tiempo_en_proc_1() {
    if (this.enEjecucion) {
      this.context.fillStyle = this.estilo
      this.context.fillRect(this.t_total * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_1(), 1000 * 1 / this.tiempo_simulacion)
    }
  }

  tiempo_en_suspendidos() {

    this.estilo = "#FF9E4A"
    this.t_suspendido = 3
    let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      this.t_suspendido -= 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        this.listos.push(this.suspendido.pop())
        console.log(this.listos)
        timer.unsubscribe()
      }
    })
  }

  notificarSuspendido() {
    this.srtfService.postNotificarSuspendido()
      .then(() => {
        // this.listarSuspendido()
        this.tiempo_en_suspendidos()
      })
  }
  // ||--------------------------------------------------------------------------------------||
  // ||------------------------------------------PROCESADOR 2--------------------------------||
  // ||--------------------------------------------------------------------------------------||

  tiempo_en_proc_2() {

    if (this.enEjecucion) {
      this.context_2.fillStyle = this.estilo_2
      this.context_2.fillRect(this.t_total_2 * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_2(), 1000 * 1 / this.tiempo_simulacion)
    }
  }

  tiempo_en_suspendidos_2() {

    this.estilo = "#FF9E4A"
    this.t_suspendido_2 = 3
    let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      this.t_suspendido_2 -= 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        this.listos_2.push(this.suspendido_2.pop())
        console.log(this.listos_2)
        timer.unsubscribe()
      }
    })
  }

  notificarSuspendido_2() {
    this.srtfService.postNotificarSuspendido_2()
      .then(() => {
        // this.listarSuspendido()
        this.tiempo_en_suspendidos_2()
      })
  }

  // |--------------------------------------------------------------------------------------||
  // |----------------------------------------------PROCESADOR 3----------------------------||
  // |--------------------------------------------------------------------------------------||
  tiempo_en_proc_3() {

    if (this.enEjecucion) {
      this.context_3.fillStyle = this.estilo_3
      this.context_3.fillRect(this.t_total_3 * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_3(), 1000 * 1 / this.tiempo_simulacion)
    }
  }

  tiempo_en_suspendidos_3() {

    this.estilo = "#FF9E4A"
    this.t_suspendido_3 = 3
    let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      this.t_suspendido -= 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        this.listos_3.push(this.suspendido_3.pop())
        console.log(this.listos_3)
        timer.unsubscribe()
      }
    })
  }

  notificarSuspendido_3() {
    this.srtfService.postNotificarSuspendido_3()
      .then(() => {
        // this.listarSuspendido()
        this.tiempo_en_suspendidos_3()
      })
  }
  // ||---------------------------------------OTRAS OPERACIONES----------------------------||


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
    document.text("ALGORITMO DE PLANIFICACIÓN SRTF", 20, 20)

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

    if (rendimiento > 0.40 && rendimiento < 0.70) {
      document.setTextColor(255, 0, 0)
      document.text("Malo", 140, 80)
    }

    if (rendimiento > 0.70 && rendimiento < 0.80) {
      document.setTextColor(255, 158, 74)
      document.text("Medio", 140, 80)
    }

    if (rendimiento > 0.80) {

      document.setTextColor(0, 255, 0)
      document.text("Bueno", 140, 80)
    }

    document.setTextColor(0, 0, 0)
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

    if (rendimiento_2 > 0.40 && rendimiento_2 < 0.65) {

      document.setTextColor(255, 0, 0)
      document.text("Malo", 140, 140)
    }

    if (rendimiento_2 > 0.65 && rendimiento_2 < 0.80) {
      document.setTextColor(255, 158, 74)
      document.text("Medio", 140, 140)
    }

    if (rendimiento_2 > 0.80) {
      document.setTextColor(0, 255, 0)
      document.text("Bueno", 140, 140)
    }

    document.setTextColor(0, 0, 0)
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
    if (rendimiento_3 > 0.40 && rendimiento_3 < 0.70) {

      document.setTextColor(255, 0, 0)
      document.text("Malo", 140, 200)
    }

    if (rendimiento_3 > 0.70 && rendimiento_3 < 0.80) {
      document.setTextColor(255, 158, 74)
      document.text("Medio", 140, 200)
    }

    if (rendimiento_3 > 0.80) {

      document.setTextColor(0, 255, 0)
      document.text("Bueno", 140, 200)
    }

    document.setTextColor(0, 0, 0)
    document.text("Total procesos: " + this.total_procesos_3.length.toString(), 20, 210)

    //ARCHIVO
    document.save('metricas.pdf')
  }
}

