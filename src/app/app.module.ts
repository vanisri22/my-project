import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { SessionComponent, } from './components/session/session.component';
import { MonProfilComponent } from './components/mon-profil/mon-profil.component';
import { PreventLoggedInAccess } from '../app/components/prevent';
import { PdfViewerModule } from 'ng2-pdf-viewer/dist';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PresentationListComponent } from './components/presentation-list/presentation-list.component';
import { PresentationDetailsComponent } from './components/presentation-details/presentation-details.component';
import { PresentationService } from './services/presentation.service';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { NgDragDropModule } from 'ng-drag-drop';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'newmember', component: InscriptionComponent },
  { path: 'newsession', component: SessionComponent, canActivate: [PreventLoggedInAccess] },
  { path: 'profile', component: MonProfilComponent, canActivate: [PreventLoggedInAccess] },
  {path: 'presentations', component: PresentationListComponent, canActivate: [PreventLoggedInAccess]},
  { path: 'presentations/:id', component: PresentationDetailsComponent, canActivate: [PreventLoggedInAccess] },
  { path: '', redirectTo: '/presentations', pathMatch: 'full' },
  { path: 'aboutUs', component: AboutUsComponent },

];


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    PdfViewerModule,
    NgDragDropModule.forRoot(),

  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    InscriptionComponent,
    SessionComponent,
    MonProfilComponent,
    AboutUsComponent,
    PresentationListComponent,
    PresentationDetailsComponent,

  ],
  providers: [HttpModule, HomeComponent, PreventLoggedInAccess, PresentationService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

