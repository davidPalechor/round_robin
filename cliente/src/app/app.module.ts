import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

//Servicios
import { RoundrobinService } from './services/roundrobin.service';
import { SjfService } from './services/sjf.service';


//Componentes
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RoundrobinComponent } from './roundrobin/roundrobin.component';
import { SjfComponent } from './sjf/sjf.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RoundrobinComponent,
    SjfComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    RoundrobinService,
    SjfService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
