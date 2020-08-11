import { v4 as uuid } from 'uuid';

export class DestinoViaje {
    voteDown() {
        this.votes--;
    }

    voteUp() {
        this.votes++;
    }
    private selected: boolean;
    public servicios: string[];
    id = uuid();

    constructor(public nombre: string, public url: string, public votes: number = 0) {
        this.servicios = ['pileta', 'desayuno'];
    }

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(s: boolean) {
        this.selected = s;
    }
}