import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SrtfService } from '../services/srtf.service';
import { SjfService } from '../services/sjf.service';
import { RoundrobinService } from '../services/roundrobin.service';

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

  private prioridad = 1;

  private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    procesador: 1,
    quantum: 0,
    estado: 'ejecucion',
    prioridad: this.prioridad
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
  private t_cpu = 0
  private t_cpu_2 = 0
  private t_cpu_3 = 0


  private enEjecucion = false;
  private tiempo_simulacion = 1;




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
    //this.prepararCanvas()
    this.terminarEjecucion()
    this.enEjecucion = true
    this.postEjecutarProcesos()
    this.startProcesador_1()
    //this.tiempo_en_proc_1()

    //this.startProcesador_2()
    //this.tiempo_en_proc_2()


    //this.startProcesador_3()
    //this.tiempo_en_proc_3()

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
        this.ejecucion.length == 0) {
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
    if (this.enEjecucion) {
      if (this.ejecucion.length == 0) {
        if (this.listos_RR_1.length > 0) {
          this.postEjecutarProcesos()
          this.ejecucion.push(this.listos_RR_1.shift())
        }
      } else {
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
      }
      setTimeout(() => this.startProcesador_1(), 1000 * 1 / this.tiempo_simulacion)
    }
  }


  getListosRR() {
    this.rrService.getInfoListos()
      .then(data => {
        this.listos_RR_1 = data[0]
        console.log(data)
      })
  }

  notificarSuspendido(algoritmo){
    if(algoritmo == 1){
      this.rrService.postNotificarSuspendido()
      .then(()=> this.tiempo_en_suspendidos())
    }
  }

  tiempo_en_suspendidos(){
    //this.estilo = "#FF9E4A"
    let timer = Observable.timer(0, 1000 * 1 / this.tiempo_simulacion).subscribe(tiempo => {
      tiempo += 1
      if (tiempo == 3) {
        console.log("De suspendidos a Listos")
        let quantum = this.calcularQuantum(this.listos_RR_1,this.suspendido[0].tiempo)
        this.suspendido[0].quantum = quantum
        this.listos_RR_1.push(this.suspendido.pop())
        console.log(this.listos_RR_1)
        timer.unsubscribe()
      }
    })
  }

  getListosSjf() {
    this.sjfService.getInfoListos()
      .then(data => this.listos_sjf_1 = data[0])
  }

  getListosSrtf() {
    this.srtfService.getInfoListos()
      .then(data => this.listos_srtf_1 = data[0])
  }


  postAgregarProceso() {
    if (this.prioridad == 1) {
      this.rrService.postAgregarProceso(this.param)
        .then(() => this.getListosRR())
    }
    if (this.prioridad == 2) {
      this.sjfService.postAgregarProceso(this.param)
        .then(() => this.getListosSjf())
    }
    if (this.prioridad == 3) {
      this.srtfService.postAgregarProceso(this.param)
        .then(() => this.getListosSrtf())
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


// ||-----------------------OTRAS OPERACIONES ---------------------------------||
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
}
