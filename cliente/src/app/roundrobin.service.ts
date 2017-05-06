import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RoundrobinService {
	private apiURL = 'localhost:8000/round_robin/'
  
  constructor(private http:Http) { }

  getInfoHilos(){
  	return this.http.get(this.apiURL)
  		.toPromise()
  		.then(response => response.json())
  		.catch(this.handleError);
  }

  private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
