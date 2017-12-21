import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  model: any = {};
  messageErreur = "";

  constructor(private http: Http, private router: Router) { }

  onSubmit(f: NgForm) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log("Mot de passe " + this.model.password);
    var body = 'nom=' + this.model.nom + '&prenom=' + this.model.prenom + '&email=' + this.model.email + '&password=' + this.model.password;
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://localhost:8082/signin', body, options)
      .subscribe(
      res => {
        let token = res.json();
        console.log(token.token);
        if (token.token == "inscription échoué") {
          this.messageErreur = "L'email entré est déjà utilisée";
        } else {
          localStorage.setItem('currentUser', token.token);
          this.router.navigate(['/home']);
          this.messageErreur = "Connectez vous avec vos identifiants";
        }
      },
      err => {
        console.log(err);
      }
      );
    console.log(JSON.stringify(this.model));  // { first: '', last: '' }
    console.log(f.valid);  // false*/
  }
  logout() {
    localStorage.removeItem('currentUser');
  }





  /* console.log(this.model.inputNom);  // { first: '', last: '' }
   console.log(this.model.inputPrenom);
   console.log(this.model.inputEmail);
   console.log(this.model.motDePasse);
   
   console.log(f.valid);  // false*/

  ngOnInit() {
    
  }


}
