import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import Dexie from 'dexie';

import {
  DestinosViajesState,
  intializeDestinosViajesState,
  reducerDestinosViajes,
  DestinosViajesEffects,
  InitMyDataAction,
} from './models/destinos-viajes-state.model';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logeado/usuario-logeado.guard';
import { VuelosComponentComponent } from './components/vuelos/vuelos-component/vuelos-component.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component.component';
import { VuelosDetalleComponentComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';
import { DestinoViaje } from './models/destino-viaje.model';
import { Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';
import { ChatComponent } from './components/chat/chat.component';

//app config
export interface AppConfig {
  apiEndpoint: String;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: "http://localhost:3000"
};

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
//fin app config

export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponent },
  { path: 'mas-info', component: VuelosMasInfoComponent },
  { path: ':id', component: VuelosDetalleComponentComponent },
];

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [UsuarioLogueadoGuard]
  },
  {
    path: 'vuelos',
    component: VuelosComponentComponent,
    canActivate: [UsuarioLogueadoGuard],
    children: childrenRoutesVuelos
  }
];// redux init
export interface AppState {
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const reducersInitialState = {
  destinos: intializeDestinosViajesState()
};
// fin redux init


// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.intializeDestinosViajesState();
}

@Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) { }
  async intializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'X-API-TOKEN': 'token-seguridad' });
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

// fin app init


// dexie db
export class Translation {
  constructor(public id: number, public lang: string, public key: string, public value: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id, nombre, imagenUrl'
    });
    this.version(2).stores({
      destinos: '++id, nombre, imagenUrl',
      translations: '++id, lang, key, value'
    });
  }
}

export const db = new MyDatabase();
// fin dexie db

// i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
      .where('lang')
      .equals(lang)
      .toArray()
      .then(results => {
        if (results.length === 0) {
          return this.http
            .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang=' + lang)
            .toPromise()
            .then(apiResults => {
              db.translations.bulkAdd(apiResults);
              return apiResults;
            });
        }
        return results;
      }).then((traducciones) => {
        console.log('traducciones cargadas:');
        console.log(traducciones);
        return traducciones;
      }).then((traducciones) => {
        return traducciones.map((t) => ({ [t.key]: t.value }));
      });
    /*
    return from(promise).pipe(
      map((traducciones) => traducciones.map((t) => { [t.key]: t.value}))
    );
    */
    return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}
//fin i18n

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    NavbarComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponentComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponentComponent,
    EspiameDirective,
    TrackearClickDirective,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {
      initialState: reducersInitialState,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument(),
    ReservasModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgxMapboxGLModule,
    BrowserAnimationsModule
    /*NgxMapboxGLModule.withConfig({
      accessToken: 'TOKEN', // Optional, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'TOKEN' // Optional, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })*/
  ],
  providers: [
    AuthService,
    UsuarioLogueadoGuard,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    MyDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
