import { Injectable } from '@angular/core';

@Injectable()
export class RoundrobinService {
	private apiURL = 'localhost:8000/round_robin/'
  constructor() { }

}
