import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pres } from '../pres';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationService } from '../../services/presentation.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { HttpModule } from '@angular/http';
import { NgDragDropModule } from "ng-drag-drop";
import { Elt } from '../cardObj';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.css']
})


export class PresentationDetailsComponent implements OnInit {

  pre: Pres;
  sub: any;
  pdfSrc: any;
  msg: any;
  wHeight: any;
  wWidth: any;
  card: Elt[] = new Array<Elt>();
  /*ifCard nous indique si la présentation contient ou non des colonnes*/
  ifCard: boolean = false;
  model: any = {};
  noms: string[] = new Array<string>();


  constructor(private route: ActivatedRoute, private presServ: PresentationService, private router: Router, private http: Http) {
    this.wHeight = window.screen.height;
    this.wWidth = window.screen.width;
  }

  get(name: string) {
    return this.card.find(item => item.getNom() === name);
  }

  addNewCard(s: string) {
    this.card.push(new Elt(s));
    this.noms.push(s);
  }

  addNewElementToCard(c: string, e: string) {
    this.get(c).appendContenu(e);
  }

  nameAlreadyInUse(s: string) {
    let i = 0;
    for (i = 0; i < this.card.length; i++) {
      if (this.card[i].getNom().match(s)) {
        return true;
      }
    }
    return false;
  }
  deleteCard(s: string) {
    console.log("Je recois:" + s + "." + "taille du tableau de depart:" + this.card.length);
    let i = 0;
    let res: Elt[] = new Array<Elt>();
    let resN: string[] = new Array<string>();


    for (i = 0; i < this.card.length; i++) {
      console.log("IIIIN");
      let tmp: Elt ;
      tmp= this.card.pop();
      console.log("case" + this.card[i].getNom() +"contient " + tmp.affiche());
      if (tmp.getNom() != s) {
        res.push(tmp);
        resN.push(tmp.getNom());
      }
    }

    this.card = new Array<Elt>();
   
    console.log("Je parcours le nouveau tableau de taille: " + res.length);
    for (i = 0; i < res.length; i++) {
      this.card[i] = res[i];
      this.card[i].affiche();
    }
    this.noms = new Array<string>();
    this.noms = resN;

    this.updateEmptyCard();


    console.log("SIZE" + this.card.length);
    for (i = 0; i < this.card.length; i++) {
      console.log("CASE " + i + ":");
      this.card[i].affiche();
    }
  }

  emptyCard() {
    return this.ifCard;
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  onCardDrop(e: any, c: string) {
    /* this.droppedFruits.push(e.dragData);
        this.removeItem(e.dragData, this.fruits);
        */
  }

  updateEmptyCard() {
    this.ifCard = (this.card.length > 0);
  }

  onSubmitC(f: NgForm) {
    if (!this.nameAlreadyInUse(this.model.titre)) {
      this.addNewCard(this.model.titre);
      this.updateEmptyCard();
    }

    this.msg = "Le nom de la colonne est déjà utilisé";
  }

  onSubmitP(f: NgForm) {
    console.log(this.model.contenu);
    console.log(this.model.opt);
    this.addNewElementToCard(this.model.opt, this.model.contenu);
  }

  gotoPresList() {
    let link = ['/presentations'];
    this.router.navigate(link);
  }

  ngOnInit() {
    this.msg = "Le nom de la colonne est déjà utilisé";

    /* Remplissage du tableau Card pour vérifier le fonctionnement du code  */
    this.addNewCard('hello');
    this.get('hello').appendContenu('bla1');
    this.get('hello').appendContenu('bla2');
    this.get('hello').appendContenu('bla3');

    this.addNewCard('bonjour');
    this.addNewElementToCard('bonjour', 'bli1');
    this.addNewElementToCard('bonjour', 'bli2');
    this.addNewElementToCard('bonjour', 'bli3');

    console.log(this.card.toString());

    let i: number = 0;
    console.log("SIZE" + this.card.length);
    for (i = 0; i < this.card.length; i++) {
      console.log("CASE " + i + ":");
      this.card[i].affiche();
    }


    /* FIN : Remplissage du tableau Card pour vérifier le fonctionnement du code  */


    /*this.sub = this.route.params.subscribe(param => {
      let id = Number.parseInt(param['id']);
      console.log("ID = " + id);
      this.pre = this.presServ.get(id);
      console.log("J'affiche" + this.pre.nom_pres);
    });

    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    this.http.get('http://localhost:8082/session/masession/pdf/' + this.pre.id, options)
      .subscribe(
      res => {
        let token = res.url;
        console.log(token);
        this.pdfSrc = token;

      },
      err => {
        console.log(err);
      });*/

    /*NE PAS SUPPRIMER*/
    this.ifCard = (this.card.length > 0);
  }


}
