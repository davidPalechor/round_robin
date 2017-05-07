import { Route } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { RoundrobinComponent } from './roundrobin/roundrobin.component'; 

export const routes: Route[] = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full'},
    { path: 'inicio', component: LandingComponent },
    { path: 'round_robin', component: RoundrobinComponent}
];