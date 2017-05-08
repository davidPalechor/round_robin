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
  private infoHilo = {}
  private listos = {}
  private ejecucion = {}
  private bloqueado = {}
  private suspendido = {}
  private cont = 0
  private interval

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
        this.infoHilo = data
        this.cont = data.length;
      })
  }

  postAgregarProceso() {
    this.roundRobinService.postAgregarProceso(this.param)
      .then(() => this.getInfoListos())
  }

  ejecutarProcesos(){
    this.interval = Observable.interval(1000).subscribe(x =>{
      this.postEjecutarProcesos()
    });
    // this.interval=setInterval(function(){this.postEjecutarProcesos();},3000);
  }

  postEjecutarProcesos() {
    //this.listarEjecucion()
    this.roundRobinService.postEjecutarProcesos()
      .then(() => {
        this.detenerEjecucion()
        this.listarEjecucion()
        this.getInfoListos();
      })
  }

  detenerEjecucion() {
    console.log(this.cont);
    // if (this.cont == 1){
    //   console.log("Funciona el IF");
    // }
    if (this.cont == 1) {
      this.interval.unsubscribe();
    }
  }

  listarEjecucion() {
    this.roundRobinService.getInfoEjecucion()
      .then(data => {
        this.ejecucion = data;
      })//this.ejecucion = this.infoHilo;
  }
}
