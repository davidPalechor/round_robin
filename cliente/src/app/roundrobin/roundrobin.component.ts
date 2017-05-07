import { Component, OnInit } from '@angular/core';
import { RoundrobinService} from '../services/roundrobin.service';
 
@Component({
  selector: 'app-roundrobin',
  templateUrl: './roundrobin.component.html',
  styleUrls: ['./roundrobin.component.css']
})
export class RoundrobinComponent implements OnInit {
  title = "Round Robin"
	private infoHilo = {}
	private param = {
    tiempo: null,
    nombre: null,
    recurso: null,
    prior:null
  }

  constructor(private roundRobinService:RoundrobinService) { }

  ngOnInit() {
  	this.getInfoHilos();
  }

  getInfoHilos(){
  	this.roundRobinService
  	.getInfoHilos()
  	.then(data => {
  		this.infoHilo = data;
  	})
  }

  postAgregarProceso(){
  	this.roundRobinService.postAgregarProceso(this.param)
    .then(() => this.getInfoHilos())
  }
}
