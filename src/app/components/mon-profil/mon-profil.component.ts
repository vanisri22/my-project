import { Component, OnInit } from '@angular/core';
import { User } from '../utilisateur';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import * as myGlobals from '../../globals';

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
  okNom = false;
  okPrenom = false;
  okMail = false;

  constructor(private http: Http, private router: Router, private home: HomeComponent, private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {
    this.isLoggedIn = (localStorage.getItem("currentUser") != null);
  }

  ngOnInit() {
    if (this.home.getNeed() == true) {
      document.body.style.backgroundImage = 'url(' + 'https://image.freepik.com/free-photo/blackboard-texture_1205-375.jpg' + ')';
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
      document.body.style.backgroundAttachment = " fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundColor = " #999";
    }

    this.getInfo();
    //console.log(JSON.stringify(this.model));  
  }


  nomChange(event) {
    if (this.user.nom != event) {
      console.log(this.user.nom + "," + event)
      console.log('changed', event);
      //this.model.nom=event;
      this.okNom = true;
    }
    else
      this.okNom = false;
  }



  prenomChange(event) {
    if (this.user.prenom != event) {
      console.log(this.user.prenom + "," + event)
      console.log('changed', event);
      this.okPrenom = true;
    }
    else
      this.okPrenom = false;
  }


  emailChange(event) {
    if (this.user.mail != event) {
      console.log(this.user.mail + "," + event)
      console.log('changed', event);
      this.okMail = true;
    }
    else
      this.okMail = false;
  }

  test() {
    console.log((this.okMail || this.okNom) || this.okPrenom);
    return ((this.okMail || this.okNom) || this.okPrenom);
  }

  onSubmit(f: NgForm) {
    this.ng4LoadingSpinnerService.show();
    if (this.user.mail.localeCompare(this.model.email) != 0 || this.user.prenom.localeCompare(this.model.prenom) != 0 || this.user.nom.localeCompare(this.model.nom) != 0) {
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
      let path = myGlobals.prefix+ "signin/modifcompte";

      this.http.post(path, body, options)
        .subscribe(
        res => {
          let token = res.json();
          this.ng4LoadingSpinnerService.hide();
          if (token.token == "Erreur lors de la modifiaction du compte") {
            this.message = "La modification de votre profil a échoué, veuillez réessayer";
            alert(this.message);
            this.router.navigate(['/profile']);
          }
          else {
            //console.log(token.token);
            localStorage.setItem('currentUser', token.token);
            this.message = "La modification a bien été enregistré";
            alert("Votre profil a bien été modifié");
            this.router.navigate(['/profile']);
          }
        },
        err => {
          console.log(err);
          this.ng4LoadingSpinnerService.hide();
          return;
        }
        );
    }
    else
      console.log("NOT IN ");
  }



  getName() {
    return this.user.prenom;
  }

  getEmail() {
    return this.user.mail;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getInfo() {
    this.ng4LoadingSpinnerService.show();
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
        this.ng4LoadingSpinnerService.hide();
      },
      err => {
        this.ng4LoadingSpinnerService.hide();
        console.log(err);
        alert("Impossible de récupérer vos informations, veuillez bien vouloir vous reconnectez");
        localStorage.removeItem('currentUser');
        this.router.navigate(['/home']);
      });
  }
}