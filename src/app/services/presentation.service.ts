import { Injectable } from '@angular/core';
import { Pres } from '../components/pres';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions, Response, HttpModule } from '@angular/http';
import { OnInit } from '@angular/core';

import {Observable} from 'rxjs/Rx';


@Injectable()
export class PresentationService implements OnInit{
  PRESENTATION: Pres[];
  size: number;
  load = false;
  constructor(private http: Http) {
    //this.PRESENTATION = this.init();
  }
  ngOnInit() {
    this.getAll();
  }
  
  async getAll(): Promise <Pres[]> {
    console.log("BLABLA");
    let headers = new Headers();
    console.log("BLABLA1");
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    console.log("BLABLA2");
    let options = new RequestOptions({ headers: headers });
    console.log("BLABLA3");
    try{
    let response = await 
      this.http.get('http://localhost:8082/session/messessions', options)
        .toPromise().then(
        res => {
          let token = res.json();
          console.log("here" + token.length);
          var i: number;
          if (token.length < 1)
            console.log("VIDE");
          this.PRESENTATION = new Array(token.length);
          this.size = token.length;
          for (i = token.length - 1; i >= 0; i--) {
            //console.log("JSON" + JSON.stringify(token[i] ));
            this.PRESENTATION[i] = {
              id: token[i].id_pres,
              nom_pres: token[i].nom_pres,
              date_pres: token[i].date_pres,
              support_pres: token[i].support,
              email_pres: token[i].email
            };
          }
          this.load=true;

          //localStorage.setItem("Presentations", this.PRESENTATION.toString());
          /*for (i = 0; i < token.length; i++) {
            console.log("Case " + i + ":" + this.PRESENTATION[i].id_pres + "," + this.PRESENTATION[i].nom_pres + "," + this.PRESENTATION[i].date_pres + "," + this.PRESENTATION[i].support_pres + "," + this.PRESENTATION[i].email_pres + ".");
          };*/
        });
      }catch(err){

      }

    let i: any;
    for (i = 0; i < this.PRESENTATION.length; i++) {
      console.log("Case in list component " + i + ":" + this.PRESENTATION[i].id + "," + this.PRESENTATION[i].nom_pres + "," + this.PRESENTATION[i].date_pres + "," + this.PRESENTATION[i].support_pres + "," + this.PRESENTATION[i].email_pres + ".");
    };
    return this.PRESENTATION;
  }

  get(id: number): Pres {
    console.log("IN");
    return this.PRESENTATION.find(p => p.id == id);
  }

  getTab() : Pres []{
    return this.PRESENTATION;
  }

  getSize() {
    return this.size;
  }

}
