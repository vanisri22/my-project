import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


@Injectable()
export class HeaderComponent implements OnInit {
  isLoggedIn;
  
  constructor(private home: HomeComponent,private http: Http, private router: Router) {
  }

  getBNeed(){
    return this.home.getNeed();
  }
  ngOnInit() {
    this.isLoggedIn = (localStorage.getItem('currentUser') != null);
  }

  login() {
    return (localStorage.getItem('currentUser') != null);
  }

  onLogout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
    console.log(localStorage.getItem('currentUser') == null);
  }

}
