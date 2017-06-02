import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routes } from './app.routes';
import { RouterModule } from '@angular/router';

//Servicios
import { RoundrobinService } from './services/roundrobin.service';
import { SjfService } from './services/sjf.service';
import { SrtfService} from './services/srtf.service';
import { ColasMultiplesService } from './services/colas-multiples.service'


//Componentes
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RoundrobinComponent } from './roundrobin/roundrobin.component';
import { SjfComponent } from './sjf/sjf.component';
import { SrtfComponent } from './srtf/srtf.component';
import { ColasMultiplesComponent } from './colas-multiples/colas-multiples.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RoundrobinComponent,
    SjfComponent,
    SrtfComponent,
    ColasMultiplesComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    RoundrobinService,
    SjfService,
    SrtfService,
    ColasMultiplesService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
