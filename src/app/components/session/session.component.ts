import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  model: any = {};
  form: FormGroup;
  loading: boolean = false;
  messageErreur;


  constructor(private fb: FormBuilder, private http: Http,private router: Router) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      uploadtext: ['', Validators.required],
      uploadFile: null
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('uploadFile').setValue(file);
    }
  }

  onSubmit(f: NgForm) {
    let headers = new Headers();
    //var body = 'email='+this.model.email+'&password='+this.model.password;
    headers.append('authorization','Bearer '+localStorage.getItem("currentUser"));
    let body = new FormData();
    body.append('nom', this.model.titre);
    body.append('date', this.model.date);
    body.append('uploadFile', this.form.get('uploadFile').value);
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://localhost:8082/session/creer', body, options)
      .subscribe(
      res => {
        let token = res.json();
        //console.log("Token" + token.result);
        if (token.result == "session non crée") {
          this.router.navigate(['/newsession']);
          this.messageErreur = "Impossible de créer la session, veuillez réessayer";
        } else {
          this.router.navigate(['/presentations']);
          this.messageErreur = "La session a été crée avec succès";
          //console.log("La session a été crée avec succès");
          /*REDIRECTION ????*/
        }
      },
      err => {
        console.log(err.json());
      }
      );
   // console.log(JSON.stringify(this.model));  
    //console.log(f.valid);
  }
  ngOnInit() {
  }

}
