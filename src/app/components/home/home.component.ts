import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Injectable } from "@angular/core";
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import * as myGlobals from '../../globals';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



@Injectable()
export class HomeComponent implements OnInit {
  model: any = {};
  need: boolean = true;
  crypto: any;

  loading = false;

  authenticated = (localStorage.getItem('currentUser') != null);
  messageErreur = "";
  constructor(private http: Http, private router: Router, private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {
    if (this.need == true) {
      document.body.style.backgroundImage = 'url(' + 'https://image.freepik.com/free-photo/blackboard-texture_1205-375.jpg' + ')';
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
      document.body.style.backgroundAttachment = " fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundColor = " #999";
    }
  }

  getNeed() {
    return this.need;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onSubmit(f: NgForm) {
    this.ng4LoadingSpinnerService.show();
    await this.sleep(2000);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var body = 'email=' + this.model.email + '&password=' + this.model.password;
    let options = new RequestOptions({ headers: headers });
let path = myGlobals.prefix+ "login";
    this.http.post(path, body, options)
      .subscribe(
      res => {
        let token = res.json();
        if (token.token == "email ou mot de passe inconnu") {
          this.messageErreur = "email ou mot de passe inconnu";
          alert(this.messageErreur);
          location.reload();
        } else {
          localStorage.setItem('currentUser', token.token);
          this.authenticated = (localStorage.getItem('currentUser') != null);
          //console.log("home" + this.authenticated);
          this.router.navigate(['/profile']);
        }
      },
      err => {
        console.log(err);
        this.ng4LoadingSpinnerService.hide();
        return;
      }
      );

    this.ng4LoadingSpinnerService.hide();
    console.log(JSON.stringify(this.model));
    console.log(f.valid);
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return (localStorage.getItem('currentUser') != null);
  }



}
