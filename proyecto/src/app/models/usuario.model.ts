export class Usuario {
    nombre: string;
    fotoPerfil: string;
    universidad: string;
    cargo: string;

    constructor(n: string, f: string, c: string, u: string) {
        this.nombre = n;
        this.fotoPerfil = f;
        this.universidad = c;
        this.cargo = u;
    }
}