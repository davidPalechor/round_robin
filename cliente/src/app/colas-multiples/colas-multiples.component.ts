import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SrtfService } from '../services/srtf.service';
import { SjfService } from '../services/sjf.service';
import { RoundrobinService } from '../services/roundrobin.service';
import * as jsPDF from 'jspdf';
import * as jquery from 'jquery';

@Component({
  selector: 'app-colas-multiples',
  templateUrl: './colas-multiples.component.html',
  styleUrls: ['./colas-multiples.component.css'],
  providers: [SjfService, SrtfService, RoundrobinService]
})
export class ColasMultiplesComponent implements OnInit {

  title = 'Colas Múlitples Retroalimentadas'
  constructor(private rrService: RoundrobinService,
    private sjfService: SjfService,
    private srtfService: SrtfService) { }

  ngOnInit() {
    this.getRecursos();
  }

  private listos_RR_1 = []
  private listos_sjf_1 = []
  private listos_srtf_1 = []

  private suspendido = []
  private bloqueado = []
  private terminado = []
  private ejecucion = []

  private listos_RR_2 = []
  private listos_sjf_2 = []
  private listos_srtf_2 = []

  private suspendido_2 = []
  private bloqueado_2 = []
  private terminado_2 = []
  private ejecucion_2 = []

  private listos_RR_3 = []
  private listos_sjf_3 = []
  private listos_srtf_3 = []

  private suspendido_3 = []
  private bloqueado_3 = []
  private terminado_3 = []
  private ejecucion_3 = []

  private prioridad = 1;

  private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    procesador: 1,
    quantum: 0,
    estado: 'ejecucion',
    prioridad: this.prioridad,
    ttl: 0
  }



  private items_recursos = []
  private recurso_disponible = []
  private recurso_en_uso = []
  private recurso = {
    value: null
  }

  private t_total = 0
  private t_total_2 = 0
  private t_total_3 = 0

  private total_procesos = []
  private total_procesos_2 = []
  private total_procesos_3 = []

  private t_cpu = 0
  private t_cpu_2 = 0
  private t_cpu_3 = 0

  private t_suspendido = 3
  private t_suspendido_2 = 3
  private t_suspendido_3 = 3

  private enEjecucion = false;
  private tiempo_simulacion = 1;


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
    this.postEjecutarProcesos()

    this.startProcesador_1()
    this.tiempo_en_proc_1()

    this.startProcesador_2()
    this.tiempo_en_proc_2()


    this.startProcesador_3()
    this.tiempo_en_proc_3()

    //this.tiempo_en_proc_2()
  }

  postEjecutarProcesos() {
    this.rrService.postEjecutarProcesos()
    this.sjfService.postEjecutarProcesos()
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
      if (this.listos_RR_1.length == 0 &&
        this.listos_sjf_1.length == 0 &&
        this.listos_srtf_1.length == 0 &&
        this.suspendido.length == 0 &&
        this.bloqueado.length == 0 &&
        this.ejecucion.length == 0 &&

        this.listos_RR_2.length == 0 &&
        this.listos_sjf_2.length == 0 &&
        this.listos_srtf_2.length == 0 &&
        this.suspendido_2.length == 0 &&
        this.bloqueado_2.length == 0 &&
        this.ejecucion_2.length == 0 &&

        this.listos_RR_3.length == 0 &&
        this.listos_sjf_3.length == 0 &&
        this.listos_srtf_3.length == 0 &&
        this.suspendido_3.length == 0 &&
        this.bloqueado_3.length == 0 &&
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

  @ViewChild("gant_1") gant_p1
  @ViewChild("gant_2") gant_p2
  @ViewChild("gant_3") gant_p3

  prepararColas() {
    //this.inicializarVariables()
    this.getListosRR()
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

  startProcesador_1() {
    if (this.enEjecucion) {
      this.listos_sjf_1 = this.ordenarCola(this.listos_sjf_1);
      this.listos_srtf_1 = this.ordenarCola(this.listos_srtf_1);
      if (this.ejecucion.length == 0) {
        var index;
        if (this.listos_RR_1.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos_RR_1.shift())
          this.t_total += 1
        } else if (this.listos_sjf_1.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos_sjf_1.shift())
          this.t_total += 1
        } else if (this.listos_srtf_1.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos_srtf_1.shift())
          this.t_total += 1
        }
      }

    } else {

      this.estilo = "#00FF00"
      this.t_total += 1;
      this.t_cpu += 1;

      if (this.listos_sjf_1.length > 0) {
        for (let i = 0; i < this.listos_sjf_1.length; i++) {
          this.listos_sjf_1[i].ttl -= 1;

          if (this.listos_sjf_1[i].ttl == 0) {
            var aux = this.calcularQuantum(this.listos_RR_1, this.listos_sjf_1[i].tiempo)
            this.listos_sjf_1[i].quantum = aux
            this.listos_RR_1.push(this.listos_sjf_1.splice(i, 1)[0])
          }
        }
      }

      if (this.listos_srtf_1.length > 0) {
        for (let i = 0; i < this.listos_srtf_1.length; i++) {
          this.listos_srtf_1[i].ttl -= 1;

          if (this.listos_srtf_1[i].ttl == 0) {
            this.listos_srtf_1[i].ttl = Math.round(this.listos_srtf_1[i].tiempo * 1.5)
            this.listos_sjf_1.push(this.listos_srtf_1.splice(i, 1)[0])
          }
        }
      }

      if (this.ejecucion[0].prioridad == 'sistema') {        //---------------RoundRobin-----------||
        this.ejecucion[0].tiempo -= 1;
        this.ejecucion[0].quantum -= 1;

        if (this.ejecucion[0].tiempo > this.ejecucion[0].quantum) {
          if (this.ejecucion[0].quantum == 0) {
            this.suspendido.push(this.ejecucion.pop())
            this.notificarSuspendido(1);
            if (this.listos_RR_1.length > 0) {
              this.ejecucion.push(this.listos_RR_1.shift())
            }
          }
        } else {
          if (this.ejecucion[0].tiempo == 0) {
            this.terminado.push(this.ejecucion.pop())
          }
        }
      } else if (this.ejecucion[0].prioridad == 'E/S') {  //---------------SJF-----------||
        this.ejecucion[0].tiempo -= 1;
        if (this.ejecucion[0].tiempo == 0) {
          this.terminado.push(this.ejecucion.pop())
        }
      } else {                              //---------------SRTF-----------||
        this.ejecucion[0].tiempo -= 1;
        if (this.listos_srtf_1.length > 0) {
          if (this.ejecucion[0].tiempo > this.listos_srtf_1[0].tiempo) {
            this.suspendido.push(this.ejecucion.pop())
            this.notificarSuspendido(3)
            this.ejecucion.push(this.listos_srtf_1.shift())
          }
        }
        if (this.ejecucion[0].tiempo == 0) {
          this.terminado.push(this.ejecucion.shift())
          //this.tiempo_ejecucion = 0;
          this.recurso_disponible.push(this.recurso_en_uso.shift())
          console.log("[PROC 1] Recurso Liberado ", this.recurso_disponible)

        }
      }
    }
    setTimeout(() => this.startProcesador_1(), 1000 * 1 / this.tiempo_simulacion)
  }


  startProcesador_2() {
    if (this.enEjecucion) {
      this.listos_sjf_2 = this.ordenarCola(this.listos_sjf_2);
      this.listos_srtf_2 = this.ordenarCola(this.listos_srtf_2);
      if (this.ejecucion_2.length == 0) {
        if (this.listos_RR_2.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_2.push(this.listos_RR_2.shift())
          this.t_total_2 += 1
        }
      } else if (this.listos_sjf_2.length > 0) {
        this.postEjecutarProcesos()
        this.ejecucion_2.push(this.listos_sjf_2.shift())
        var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_2[0].recurso)
        this.t_total_2 += 1
      } else if (this.listos_srtf_2.length > 0) {
        this.postEjecutarProcesos()
        this.ejecucion_2.push(this.listos_srtf_2.shift())
        var index = this.indexRecurso(this.recurso_disponible, this.ejecucion_2[0].recurso)
        this.t_total_2 += 1
      }

    } else {

      this.estilo_2 = "#00FF00"
      this.t_total_2 += 1;
      this.t_cpu_2 += 1;

      if (this.listos_sjf_2.length > 0) {
        for (let i = 0; i < this.listos_sjf_2.length; i++) {
          this.listos_sjf_2[i].ttl -= 1;

          if (this.listos_sjf_2[i].ttl == 0) {
            var aux = this.calcularQuantum(this.listos_RR_2, this.listos_sjf_2[i].tiempo)
            this.listos_sjf_2[i].quantum = aux
            this.listos_RR_2.push(this.listos_sjf_2.splice(i, 1)[0])
          }
        }
      }

      if (this.listos_srtf_2.length > 0) {
        for (let i = 0; i < this.listos_srtf_2.length; i++) {
          this.listos_srtf_2[i].ttl -= 1;

          if (this.listos_srtf_2[i].ttl == 0) {
            this.listos_srtf_2[i].ttl = Math.round(this.listos_srtf_2[i].tiempo * 1.5)
            this.listos_sjf_2.push(this.listos_srtf_2.splice(i, 1)[0])
          }
        }
      }

      if (this.ejecucion_2[0].prioridad == 'sistema') {        //---------------RoundRobin-----------||
        this.ejecucion_2[0].tiempo -= 1;
        this.ejecucion_2[0].quantum -= 1;

        if (this.ejecucion_2[0].tiempo > this.ejecucion_2[0].quantum) {
          if (this.ejecucion_2[0].quantum == 0) {
            this.suspendido_2.push(this.ejecucion_2.pop())
            this.notificarSuspendido_2(1);
            if (this.listos_RR_2.length > 0) {
              this.ejecucion_2.push(this.listos_RR_2.shift())
            }
          }
        } else {
          if (this.ejecucion_2[0].tiempo == 0) {
            this.terminado_2.push(this.ejecucion_2.pop())
          }
        }
      } else if (this.ejecucion_2[0].prioridad == 'E/S') {  //---------------SJF-----------||
        this.ejecucion_2[0].tiempo -= 1;
        if (this.ejecucion_2[0].tiempo == 0) {
          this.terminado_2.push(this.ejecucion_2.pop())
        }
      } else {                              //---------------SRTF-----------||
        this.ejecucion_2[0].tiempo -= 1;
        if (this.listos_srtf_2.length > 0) {
          if (this.ejecucion_2[0].tiempo > this.listos_srtf_2[0].tiempo) {
            this.suspendido_2.push(this.ejecucion_2.pop())
            this.notificarSuspendido_2(3)
            this.ejecucion_2.push(this.listos_srtf_2.shift())
          }
        }
        if (this.ejecucion_2[0].tiempo == 0) {
          this.terminado_2.push(this.ejecucion_2.shift())
          //this.tiempo_ejecucion_2 = 0;
          this.recurso_disponible.push(this.recurso_en_uso.shift())
        }
      }
    }
    setTimeout(() => this.startProcesador_2(), 1000 * 1 / this.tiempo_simulacion)
  }


  startProcesador_3() {
    if (this.enEjecucion) {
      this.listos_sjf_3 = this.ordenarCola(this.listos_sjf_3);
      this.listos_srtf_3 = this.ordenarCola(this.listos_srtf_3);
      if (this.ejecucion_3.length == 0) {
        if (this.listos_RR_3.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_3.push(this.listos_RR_3.shift())
          this.t_total_3 += 1
        } else if (this.listos_sjf_3.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_3.push(this.listos_sjf_3.shift())
          this.t_total_3 += 1
        } else if (this.listos_srtf_3.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion_3.push(this.listos_srtf_3.shift())
          this.t_total_3 += 1
        }
      } else {

        this.estilo_3 = "#00FF00"
        this.t_total_3 += 1;
        this.t_cpu_3 += 1;

        if (this.listos_sjf_3.length > 0) {
          for (let i = 0; i < this.listos_sjf_3.length; i++) {
            this.listos_sjf_3[i].ttl -= 1;

            if (this.listos_sjf_3[i].ttl == 0) {
              var aux = this.calcularQuantum(this.listos_RR_3, this.listos_sjf_3[i].tiempo)
              this.listos_sjf_3[i].quantum = aux
              this.listos_RR_3.push(this.listos_sjf_3.splice(i, 1)[0])
            }
          }
        }

        if (this.listos_srtf_3.length > 0) {
          for (let i = 0; i < this.listos_srtf_3.length; i++) {
            this.listos_srtf_3[i].ttl -= 1;

            if (this.listos_srtf_3[i].ttl == 0) {
              this.listos_srtf_3[i].ttl = Math.round(this.listos_srtf_3[i].tiempo * 1.5)
              this.listos_sjf_3.push(this.listos_srtf_3.splice(i, 1)[0])
            }
          }
        }

        if (this.ejecucion_3[0].prioridad == 'sistema') {        //---------------RoundRobin-----------||
          this.ejecucion_3[0].tiempo -= 1;
          this.ejecucion_3[0].quantum -= 1;

          if (this.ejecucion_3[0].tiempo > this.ejecucion_3[0].quantum) {
            if (this.ejecucion_3[0].quantum == 0) {
              this.suspendido_3.push(this.ejecucion_3.pop())
              this.notificarSuspendido_3(1);
              if (this.listos_RR_3.length > 0) {
                this.ejecucion_3.push(this.listos_RR_3.shift())
              }
            }
          } else {
            if (this.ejecucion_3[0].tiempo == 0) {
              this.terminado_3.push(this.ejecucion_3.pop())
            }
          }
        } else if (this.ejecucion_3[0].prioridad == 'E/S') {  //---------------SJF-----------||
          this.ejecucion_3[0].tiempo -= 1;
          if (this.ejecucion_3[0].tiempo == 0) {
            this.terminado_3.push(this.ejecucion_3.pop())
          }
        } else {                              //---------------SRTF-----------||
          this.ejecucion_3[0].tiempo -= 1;
          if (this.listos_srtf_3.length > 0) {
            if (this.ejecucion_3[0].tiempo > this.listos_srtf_3[0].tiempo) {
              this.suspendido_3.push(this.ejecucion_3.pop())
              this.notificarSuspendido_3(3)
              this.ejecucion_3.push(this.listos_srtf_3.shift())
            }
          }
          if (this.ejecucion_3[0].tiempo == 0) {
            this.terminado_3.push(this.ejecucion_3.shift())
            //this.tiempo_ejecucion_3 = 0;
            //this.recurso_disponible.push(this.recurso_en_uso.shift())
            console.log("[PROC 1] Recurso Liberado ", this.recurso_disponible)
          }
        }
      }
      setTimeout(() => this.startProcesador_3(), 1000 * 1 / this.tiempo_simulacion)
    }
  }

  tiempo_en_proc_1() {
    if (this.enEjecucion) {
      this.context.fillStyle = this.estilo
      this.context.fillRect(this.t_total * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_1(), 1000 * 1 / this.tiempo_simulacion)
    }
  }


  notificarSuspendido(algoritmo) {
    if (algoritmo == 1) {
      this.rrService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos(1))
    } else {
      this.srtfService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos(3))
    }
  }

  tiempo_en_suspendidos(algoritmo) {
    this.estilo = "#FF9E4A"
    this.t_suspendido = 3
    if (algoritmo == 1) {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          let quantum = this.calcularQuantum(this.listos_RR_1, this.suspendido[0].tiempo)
          this.suspendido[0].quantum = quantum
          this.listos_RR_1.push(this.suspendido.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    } else {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        tiempo += 1
        this.t_suspendido -= 1
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          this.listos_srtf_1.push(this.suspendido.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    }
  }
  // --------------------------------------------------------------------------------------||
  // -------------------------------------------PROCESADOR 2-------------------------------||

  tiempo_en_proc_2() {
    if (this.enEjecucion) {
      this.context_2.fillStyle = this.estilo_2
      this.context_2.fillRect(this.t_total_2 * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_2(), 1000 * 1 / this.tiempo_simulacion)
    }
  }


  notificarSuspendido_2(algoritmo) {
    if (algoritmo == 1) {
      this.rrService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos_2(1))
    } else {
      this.srtfService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos_2(3))
    }
  }

  tiempo_en_suspendidos_2(algoritmo) {
    this.estilo = "#FF9E4A"
    this.t_suspendido_2 = 3
    if (algoritmo == 1) {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          let quantum = this.calcularQuantum(this.listos_RR_1, this.suspendido_2[0].tiempo)
          this.suspendido_2[0].quantum = quantum
          this.listos_RR_2.push(this.suspendido_2.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    } else {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        tiempo += 1
        this.t_suspendido_2 -= 1
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          this.listos_srtf_2.push(this.suspendido_2.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    }
  }

  // -------------------------------------------------------------------------------------||
  // -------------------------------------------PROCESADOR 3-------------------------------||

  tiempo_en_proc_3() {
    if (this.enEjecucion) {
      this.context_3.fillStyle = this.estilo_3
      this.context_3.fillRect(this.t_total_3 * 2, 0, 2, 20)

      setTimeout(() => this.tiempo_en_proc_3(), 1000 * 1 / this.tiempo_simulacion)
    }
  }


  notificarSuspendido_3(algoritmo) {
    if (algoritmo == 1) {
      this.rrService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos_3(1))
    } else {
      this.srtfService.postNotificarSuspendido()
        .then(() => this.tiempo_en_suspendidos_3(3))
    }
  }

  tiempo_en_suspendidos_3(algoritmo) {
    this.estilo = "#FF9E4A"
    this.t_suspendido_3 = 3
    if (algoritmo == 1) {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          let quantum = this.calcularQuantum(this.listos_RR_3, this.suspendido_3[0].tiempo)
          this.suspendido_3[0].quantum = quantum
          this.listos_RR_3.push(this.suspendido_3.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    } else {
      let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
        tiempo += 1
        this.t_suspendido_3 -= 1
        if (tiempo == 3) {
          console.log("De suspendidos a Listos")
          this.listos_srtf_3.push(this.suspendido_3.pop())
          //this.estilo = "#00FF00"
          timer.unsubscribe()
        }
      })
    }
  }



  // ||-----------------------OTRAS OPERACIONES ---------------------------------||

  getListosRR() {
    this.rrService.getInfoListos()
      .then(data => {
        this.listos_RR_1 = data[0]
        this.listos_RR_2 = data[1]
        this.listos_RR_3 = data[2]
      })
  }


  getListosSjf() {
    this.sjfService.getInfoListos()
      .then(data => {
        this.listos_sjf_1 = data[0]
        this.listos_sjf_2 = data[1]
        this.listos_sjf_3 = data[2]
      })
  }

  getListosSrtf() {
    this.srtfService.getInfoListos()
      .then(data => {
        this.listos_srtf_1 = data[0]
        this.listos_srtf_2 = data[1]
        this.listos_srtf_3 = data[2]
      })
  }


  postAgregarProceso() {

    var info = jquery.extend({}, this.param)
    if (this.param.procesador == 1) {
      this.total_procesos.push(this.param);
      if (this.prioridad == 1) {
        this.rrService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosRR()
            } else {
              if (this.param.procesador == 1) {
                var aux = this.calcularQuantum(this.listos_RR_1, info.tiempo)
                info.quantum = aux
                info.prioridad = 'sistema'
                this.listos_RR_1.push(info)
              }
            }
          })
      }
      if (this.prioridad == 2) {
        this.sjfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSjf()
            } else {
              if (this.param.procesador == 1) {
                info.ttl = info.tiempo * 1.5
                info.prioridad = 'E/S'
                this.listos_sjf_1.push(info)
              }
            }
          })
      }
      if (this.prioridad == 3) {
        this.srtfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSrtf()
            } else {
              if (this.param.procesador == 1) {
                info.ttl = info.tiempo * 1.5
                info.prioridad = 'Usuario'
                this.listos_srtf_1.push(info)
              }
            }
          })
      }
    }

    if (this.param.procesador == 2) {
      this.total_procesos_2.push(this.param);
      if (this.prioridad == 1) {
        this.rrService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosRR()
            } else {
              var aux = this.calcularQuantum(this.listos_RR_2, info.tiempo)
              info.quantum = aux
              info.prioridad = 'sistema'
              this.listos_RR_2.push(info)

            }
          })
      }
      if (this.prioridad == 2) {
        this.sjfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSjf()
            } else {
              info.ttl = info.tiempo * 1.5
              info.prioridad = 'E/S'
              this.listos_sjf_2.push(info)

            }
          })
      }
      if (this.prioridad == 3) {
        this.srtfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSrtf()
            } else {
              info.ttl = info.tiempo * 1.5
              info.prioridad = 'Usuario'
              this.listos_srtf_2.push(info)
            }
          })
      }
    }

    if (this.param.procesador == 3) {
      this.total_procesos_3.push(this.param);
      if (this.prioridad == 1) {
        this.rrService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosRR()
            } else {
              var aux = this.calcularQuantum(this.listos_RR_3, info.tiempo)
              info.quantum = aux
              info.prioridad = 'sistema'
              this.listos_RR_3.push(info)

            }
          })
      }
      if (this.prioridad == 2) {
        this.sjfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSjf()
            } else {
              info.ttl = info.tiempo * 1.5
              info.prioridad = 'E/S'
              this.listos_sjf_3.push(info)

            }
          })
      }
      if (this.prioridad == 3) {
        this.srtfService.postAgregarProceso(this.param)
          .then(() => {
            if (!this.enEjecucion) {
              this.getListosSrtf()
            } else {
              info.ttl = info.tiempo * 1.5
              info.prioridad = 'Usuario'
              this.listos_srtf_3.push(info)
            }
          })
      }
    }
  }

  postCrearRecurso() {
    this.rrService.postCrearRecurso(this.recurso)
    this.srtfService.postCrearRecurso(this.recurso)
    this.sjfService.postCrearRecurso(this.recurso)
      .then(() => {
        console.log("Recurso creado")
        this.getRecursos();
        // this.recurso_disponible.push(this.recurso.value)
      })
  }

  getRecursos() {
    this.sjfService.getRecursos()
      .then(data => {
        this.items_recursos = data;
        this.recurso_disponible = this.items_recursos.slice(0);
      })
  }


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



  //||---------------------------------------METRICAS-----------------------------------||
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
    document.text("COLAS MÚLTIPLES RETROALIMENTADAS", 20, 20)

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