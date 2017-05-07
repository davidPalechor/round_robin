import { Component, OnInit } from '@angular/core';
import { RoundrobinService} from '../services/roundrobin.service';
 
@Component({
  selector: 'app-roundrobin',
  templateUrl: './roundrobin.component.html',
  styleUrls: ['./roundrobin.component.css']
})
export class RoundrobinComponent implements OnInit {

	private infoHilo = {}
  constructor(private roundRobinService:RoundrobinService) { }

  ngOnInit() {
  	this.getInfoHilos();
  }

  getInfoHilos(){
  	this.roundRobinService
  	.getInfoHilos()
  	.then(data => {
  		console.log(typeof data)
  		this.infoHilo = data;
  	})
  }
}
