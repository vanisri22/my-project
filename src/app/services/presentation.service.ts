import { Injectable } from '@angular/core';
import { Pres } from '../components/pres';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions, Response, HttpModule } from '@angular/http';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PresentationService implements OnInit {
  PRESENTATION: Pres[] = new Array();
  size: number;
  load = false;
  empty: boolean = false;
  tab = new Array();
  constructor(private http: Http) {
    this.empty = false;;
    //this.PRESENTATION = this.init();
  }
  ngOnInit() {
    this.getAll();
  }

  getMonth(from) {
    switch (from[1]) {
      case "01":
        return "Janvier";

      case "02":
        return "Février";

      case "03":
        return "Mars";

      case "04":
        return "Avril";

      case "05":
        return "Mai";

      case "06":
        return "Juin";

      case "07":
        return "Juillet";

      case "08":
        return "Août";

      case "09":
        return "Septembre";

      case "10":
        return "Octobre";

      case "11":
        return "Novembre";

      case "12":
        return "Décembre";
    }
  }

  async getSet() {
    await this.getAll();
    return this.tab;
  }


  async getAll(): Promise<Pres[]> {
    let headers = new Headers();

    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));

    let options = new RequestOptions({ headers: headers });

    try {
      let response = await
        this.http.get('http://localhost:8082/session/messessions', options)
          .toPromise().then(
          res => {
            let token = res.json();
            console.log("here" + token.length);
            var i: number;
            if (token.length < 1) {
              console.log("VIDE");
              this.empty = true;
            }
            this.PRESENTATION = new Array(token.length);
            this.size = token.length;
            for (i = token.length - 1; i >= 0; i--) {
              //console.log("JSON" + JSON.stringify(token[i] ));
              var from = token[i].date_pres.split("-");
              this.tab.push(token[i].id_pres);
              console.log("IDDDDDDDDDDDDD" + token[i].id_pres);
              this.PRESENTATION[i] = {
                id: token[i].id_pres,
                nom_pres: token[i].nom_pres,
                //date_pres: token[i].date_pres,
                date_pres: from[2] + " " + this.getMonth(from) + " " + from[0],
                support_pres: token[i].support,
                email_pres: token[i].email
              };
            }
            this.load = true;
            //localStorage.setItem("Presentations", this.PRESENTATION.toString());
            /*for (i = 0; i < token.length; i++) {
              console.log("Case " + i + ":" + this.PRESENTATION[i].id_pres + "," + this.PRESENTATION[i].nom_pres + "," + this.PRESENTATION[i].date_pres + "," + this.PRESENTATION[i].support_pres + "," + this.PRESENTATION[i].email_pres + ".");
            };*/
          });
    } catch (err) {
      console.log("Erreur:" + err);
    }

    let i: any;
    for (i = 0; i < this.PRESENTATION.length; i++) {
      console.log("Case in list component " + i + ":" + this.PRESENTATION[i].id + "," + this.PRESENTATION[i].nom_pres + "," + this.PRESENTATION[i].date_pres + "," + this.PRESENTATION[i].support_pres + "," + this.PRESENTATION[i].email_pres + ".");
    };
    return this.PRESENTATION;
  }

  async get(id: number) {
    var i = 0;
    for (i = 0; i < this.PRESENTATION.length; i++) {
      if (this.PRESENTATION[i].id == id) {
        return this.PRESENTATION[i];
      }
    }
  }

  getTab(): Pres[] {

    return this.PRESENTATION;
  }

  getSize() {
    return this.size;
  }

}
