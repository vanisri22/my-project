interface IElt {
    nom: string;
    contenu: string[];
    longueur: number;

    getNom();
    getContenu();
    getLongueur();


    setNom(s: string);
    appendContenu(s: string);
    affiche();
}


export class Elt implements IElt {
    nom: string;
    contenu: string[];
    longueur: number;

    getNom() {
        return this.nom;
    }
    getContenu() {
        return this.contenu;
    }
    getLongueur() {
        this.longueur=this.contenu.length;
        return this.longueur;
    }

    setNom(s: string) {
        this.nom = s;
    }

    appendContenu(s: string) {
        this.contenu.push(s);
        this.longueur=this.contenu.length;
    }

    constructor(s:string){
        this.nom = s;
        this.longueur =0;
        this.contenu= new Array<string>() ;
    }

    affiche (){
        let i : number = 0;
        for(i =0; i<this.longueur; i++){
            console.log("[" + i + "]" + "=" + this.contenu[i]);
        }
    }
}