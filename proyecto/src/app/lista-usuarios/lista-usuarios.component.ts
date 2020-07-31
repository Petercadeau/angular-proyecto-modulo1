import { Component, OnInit } from '@angular/core';
import { Usuario } from './../models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[];
  constructor() {
    this.usuarios = [];
  }

  ngOnInit(): void {
  }

  addUser(n: string, f: string, c: string, u: string): boolean {
    let error: boolean = false;

    this.usuarios.forEach(element => {
      if (element.nombre == n) {
        error = true;
      } else {
        error = false;
      }
    });

    if (!error) {
      var user = new Usuario(n, f, c, u);
      this.usuarios.push(user);
    }else{
      alert("el usuario ya existe");
    }

    return false;
  }

}
