import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Http, Response, HttpModule, RequestOptions, Headers } from '@angular/http';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { Ng2FileRequiredModule } from 'ng2-file-required';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AgWordCloudModule} from 'angular4-word-cloud';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { SessionComponent, } from './components/session/session.component';
import { MonProfilComponent } from './components/mon-profil/mon-profil.component';
import { PreventLoggedInAccess } from '../app/services/prevent';
import { ForbidenLoggedInAccess } from '../app/services/forbiden';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PresentationListComponent } from './components/presentation-list/presentation-list.component';
import { PresentationDetailsComponent } from './components/presentation-details/presentation-details.component';
import { PresentationService } from './services/presentation.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WordCloudComponent } from './components/word-cloud/word-cloud.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [ForbidenLoggedInAccess] },
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [ForbidenLoggedInAccess] },
  { path: 'newmember', component: InscriptionComponent, canActivate: [ForbidenLoggedInAccess] },
  { path: 'newsession', component: SessionComponent, canActivate: [PreventLoggedInAccess] },
  { path: 'profile', component: MonProfilComponent, canActivate: [PreventLoggedInAccess] },
  { path: 'presentations', component: PresentationListComponent, canActivate: [PreventLoggedInAccess] },
  { path: 'presentations/:id', component: PresentationDetailsComponent, canActivate: [PreventLoggedInAccess] },
  { path: '', redirectTo: '/presentations', pathMatch: 'full', canActivate: [PreventLoggedInAccess] },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'newsession?refresh=1', component: SessionComponent, canActivate: [PreventLoggedInAccess] },
];


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    //PdfViewerModule,
    Ng4LoadingSpinnerModule.forRoot(),
    Ng2FileRequiredModule,
    BrowserAnimationsModule,
    AgWordCloudModule.forRoot()

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
    ImageCropperComponent,
    WordCloudComponent,
  ],
  providers: [HttpModule, HomeComponent, PreventLoggedInAccess, ForbidenLoggedInAccess, PresentationService, MonProfilComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

