import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  model: any = {};
  messageErreur = "";

  constructor(private http: Http, private router: Router, private home: HomeComponent, private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) { }

  onSubmit(f: NgForm) {
    this.ng4LoadingSpinnerService.show();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log("Mot de passe " + this.model.password);
    var body = 'nom=' + this.model.nom + '&prenom=' + this.model.prenom + '&email=' + this.model.email + '&password=' + this.model.password;
    let options = new RequestOptions({ headers: headers });
    let path = myGlobals.prefix+ "signin";

    this.http.post(path, body, options)
      .subscribe(
      res => {
        let token = res.json();
        console.log(token.result);
        if (token.result == "inscription échoué") {
          this.ng4LoadingSpinnerService.hide();
          alert("L'email entré est déjà utilisée, Veuillez réessayer");
          location.reload();
          //this.messageErreur = "L'email entré est déjà utilisée";
        } else {
          //localStorage.setItem('currentUser', token.result);
          this.ng4LoadingSpinnerService.hide();
          alert("Votre compte a bien été crée, veuillez vous connecter avec votre adresse mail et mot de passe");
          this.router.navigate(['/home']);
          //this.messageErreur = "Connectez vous avec vos identifiants";
        }
      },
      err => {
        console.log(err);
        this.ng4LoadingSpinnerService.hide();
        return;
      });

    this.ng4LoadingSpinnerService.hide();
    console.log(JSON.stringify(this.model));  // { first: '', last: '' }
    console.log(f.valid);  // false*/
  }


  logout() {
    this.ng4LoadingSpinnerService.show();
    localStorage.removeItem('currentUser');
    this.ng4LoadingSpinnerService.hide();
    this.router.navigate(['/home']);
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
  }


}
