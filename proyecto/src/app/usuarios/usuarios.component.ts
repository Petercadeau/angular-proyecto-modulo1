import { Component, OnInit, Input, HostBinding} from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {
@Input() usuario:Usuario;
@HostBinding('attr.class') cssClass = 'col-md-3';
  constructor() {
  }

  ngOnInit(): void {

  }

}
