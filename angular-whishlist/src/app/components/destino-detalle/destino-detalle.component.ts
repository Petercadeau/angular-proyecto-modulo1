import { Component, OnInit} from '@angular/core';
import { DestinoViaje } from 'src/app/models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from 'src/app/models/destinos-api-client.model';



@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers: [
    DestinosApiClient
  ],
  styles: [`

mgl-map {

height: 75vh;

width: 75vw;

}

`]
})
export class DestinoDetalleComponent implements OnInit {
  destino: DestinoViaje;
  style = {
    sources: {
      world: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
      }
    },
    version: 8,
    layers: [{
      'id': 'countries',
      'type': 'fill',
      'source': 'world',
      'layout': {},
      'paint': {
        'fill-color': '#6F788A'
      }
    }]
  };

  constructor(private route: ActivatedRoute, private destinosApiClient: DestinosApiClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.destino = this.destinosApiClient.getById(id);
  }

}
