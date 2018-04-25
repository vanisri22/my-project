import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { Router } from '@angular/router';


@Injectable()
export class ForbidenLoggedInAccess implements CanActivate {
    constructor(private home: HomeComponent, private router: Router) { }

    canActivate() {
        if (this.home.isLoggedIn()) {
            this.router.navigate(['/profile']);
            return !this.home.isLoggedIn();
        }

        else {
            return true;
        }
    }
}