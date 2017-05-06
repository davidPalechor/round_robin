import { Route } from '@angular/router';

import { LandingComponent } from './landing/landing.component';

export const routes: Route[] = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full'},
    { path: 'inicio', component: LandingComponent }
];