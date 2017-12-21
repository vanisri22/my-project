import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Injectable } from "@angular/core";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



@Injectable()
export class HomeComponent implements OnInit {
  model: any = {};

  authenticated = (localStorage.getItem('currentUser')!=null);
  messageErreur = "";
  constructor(private http: Http, private router: Router) { }

  onSubmit(f: NgForm) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var body = 'email=' + this.model.email + '&password=' + this.model.password;
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://localhost:8082/login', body, options)
      .subscribe(
      res => {
        let token = res.json();
        if (token.token == "email ou mot de passe inconnu") {
          this.messageErreur = "email ou mot de passe inconnu";
        } else {
          localStorage.setItem('currentUser', token.token);
         
          this.authenticated = (localStorage.getItem('currentUser') !=null);
          //console.log("home" + this.authenticated);
          this.router.navigate(['/profile']);
        }
      },
      err => {
        console.log(err);
      }
      );
    console.log(JSON.stringify(this.model));
    console.log(f.valid);
  }

  ngOnInit() {
    console.log("Height = "  + window.screen.height + ", Width = " + window.screen.width);
  }

  isLoggedIn() {
    return (localStorage.getItem('currentUser') !=null);
  }


  
}
