import { Component, OnInit } from '@angular/core';
import { User } from '../utilisateur';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {
  user: User = {
    nom: '',
    prenom: '',
    mail: ''
  };

  model: any = {};
  isLoggedIn = false;
  message = "";
  constructor(private http: Http, private router: Router, private home: HomeComponent) {
    this.isLoggedIn = (localStorage.getItem("currentUser") != null);
  }

  onSubmit(f: NgForm) {


    if (this.user.mail != this.model.email || this.user.prenom != this.model.prenom || this.user.nom != this.model.nom) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
      //console.log("MODEL MAIL :" + this.model.email + " MODEL NOM : " + this.model.nom + " MODEL PRENOM: " + this.model.prenom);


      var body = "nom=";

      if (this.model.nom == undefined) {
        body += this.user.nom;
      } else {
        body += this.model.nom;
      }

      if (this.model.prenom == undefined) {
        body += "&prenom=";
        body += this.user.prenom;
      } else {
        body += "&prenom=";
        body += this.model.prenom;
      }

      if (this.model.email == undefined) {
        body += "&email=";
        body += this.user.mail;
      } else {
        body += "&email=";
        body += this.model.email;
      }

      let options = new RequestOptions({ headers: headers });
      //console.log("body :" + body);
      //console.log("options :" + options);
      this.http.post('http://localhost:8082/signin/modifcompte', body, options)
        .subscribe(
        res => {
          let token = res.json();
          if (token.token == "Erreur lors de la modifiaction du compte") {
            this.message = "La modification de votre profil a échoué";
            this.router.navigate(['/profile']);
          }
          else {
            //console.log(token.token);
            localStorage.setItem('currentUser', token.token);
            this.message = "La modification a bien été enregistré";

          }
        },
        err => {
          console.log(err);
        }
        );
    }
    else
      console.log("NOT IN ");
  }

  ngOnInit() {
    //if (this.isLoggedIn) {
    //console.log(this.user.nom);
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    this.http.get('http://localhost:8082/login/compte', options)
      .subscribe(
      res => {
        let token = res.json();
        console.log(token);
        console.log("J'ai recu " + token.nom + " " + token.prenom + " " + token.email);
        this.user.nom = token.nom;
        this.user.prenom = token.prenom;
        this.user.mail = token.email;
      },
      err => {
        console.log(err);
      }
      );
    //console.log(JSON.stringify(this.model));  
  }

}