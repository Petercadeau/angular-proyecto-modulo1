import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { Store } from '@ngrx/store'
import { AppState } from './../../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from 'src/app/models/destinos-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
  providers: [ DestinosApiClient],
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: string[];
  all;

  constructor(
    public destinosApiClient: DestinosApiClient,
    private store: Store<AppState>
  ) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];

    this.store.select(state => state.destinos.favorito)
    .subscribe(data => {
      const f = data;
      if (f != null) {
        this.updates.push('Se eligió: ' + f.nombre);
      }
    });
store.select(state => state.destinos.items).subscribe(items => this.all = items);
  }

  ngOnInit() {
    /*this.store.select(state => state.destinos.favorito)
      .subscribe(data => {
        const f = data;
        if (f != null) {
          this.updates.push('Se eligió: ' + f.nombre);
        }
      });*/
  }

  agregado(d: DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    //this.store.dispatch(new NuevoDestinoAction(d))
  }

  elegido(e: DestinoViaje) {
    this.destinosApiClient.elegir(e);
    //this.store.dispatch(new ElegidoFavoritoAction(e));
  }

  getAll(){}
}
