import { Route } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { RoundrobinComponent } from './roundrobin/roundrobin.component'; 
import { SjfComponent} from './sjf/sjf.component';
import { SrtfComponent } from './srtf/srtf.component';
import { ColasMultiplesComponent } from './colas-multiples/colas-multiples.component';

export const routes: Route[] = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full'},
    { path: 'inicio', component: LandingComponent },
    { path: 'round_robin', component: RoundrobinComponent},
    { path:'sjf',component:SjfComponent},
    { path: 'srtf', component:SrtfComponent},
    { path: 'colas_multiples', component:ColasMultiplesComponent }
];