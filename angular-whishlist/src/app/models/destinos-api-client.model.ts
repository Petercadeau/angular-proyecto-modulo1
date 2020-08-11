import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, AppConfig, APP_CONFIG, db } from '../app.module';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destinos-viajes-state.model';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class DestinosApiClient {
    destinos: DestinoViaje[] = [];

    constructor(
        private store: Store<AppState>,
        @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
        private http: HttpClient
    ) {
    }

    add(d: DestinoViaje) {
        const headers: HttpHeaders = new HttpHeaders({ 'X-API-TOKEN': 'token-seguridad' });
        const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', { nuevo: d.nombre }, { headers: headers });
        this.http.request(req).subscribe((data: HttpResponse<{}>) => {
            if (data.status === 200) {
                this.store.dispatch(new NuevoDestinoAction(d));
                const myDb = db;
                myDb.destinos.add(d);
                console.log('todos los destinos de la db!');
                myDb.destinos.toArray().then(destinos => console.log(destinos))
            }
        });
    }

    elegir(d: DestinoViaje) {
        this.store.dispatch(new ElegidoFavoritoAction(d))
    }

    getById(id: String): DestinoViaje {
        return this.destinos.filter(function (d) { return d.id.toString() === id; })[0];
    }


}

