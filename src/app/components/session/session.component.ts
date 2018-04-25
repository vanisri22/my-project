import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { HomeComponent } from '../home/home.component';
import { PresentationService } from '../../services/presentation.service';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  constructor(private location: Location, private fb: FormBuilder, private http: Http, private router: Router, private home: HomeComponent, private preService: PresentationService, private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {
    this.createForm();
    this.create = false;

    /*****************PARTIE CROP ***********/
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 200;
    this.cropperSettings1.height = 200;

    this.cropperSettings1.croppedWidth = 200;
    this.cropperSettings1.croppedHeight = 200;

    this.cropperSettings1.canvasWidth = 500;
    this.cropperSettings1.canvasHeight = 500;

    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;

    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = false;

    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(5,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

    this.cropperSettings1.noFileInput = true;
    this.data1 = {};

    /*******************END PARTIE CROP*************/
  }



  /*********PARTIE CROP *******************/

  data1: any;
  cropperSettings1: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  bottom: number;
  top: number;
  left: number;
  right: number;
  pdfSrc: any;
  id: number;

  create: boolean = false;


  getCreate() {
    return this.create;
  }
  /******* RECUPERATION DE L'IMAGE ********/
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;


  /*Récupération des coordonnées du cadre croppant*/
  cropped(bounds: Bounds) {
    console.log("BOTTOM" + bounds.bottom);
    console.log("TOP" + bounds.top);
    console.log("LEFT " + bounds.right);
    console.log("RIGHT" + bounds.left);

    this.bottom = bounds.bottom;
    this.top = bounds.top;
    this.left = bounds.left;
    this.right = bounds.right;
  }
  /*Fin de la récupération des coordonnées du cadre croppant*/

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /*Enregistrement et envoie des coordonnées de l'image croppé*/
  async endCrop() {
    this.ng4LoadingSpinnerService.show();
    console.log("CROP");
    this.preService.empty = false;
    this.croppedHeight = this.bottom - this.top;
    this.croppedWidth = this.right - this.left;
    //console.log("New Height" +  this.croppedHeight + " New Width" + this.croppedWidth);
    let x: number;
    let y: number;
    y = Math.min(this.top, this.bottom);
    x = Math.min(this.left, this.right);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));

    var body = { "id_pres": this.id, "x": x, "y": y, "height": this.croppedHeight, "width": this.croppedWidth };
    //console.log("Width---------------" + this.croppedWidth + "x:" + x + "y:" + y);
    let options = new RequestOptions({ headers: headers });
let path = myGlobals.prefix + "session/cropimage";

    await this.http.post(path, JSON.stringify(body), options)
      .subscribe(
      res => {
        let token = res.json();
        if (token.result == "Image not cropped") {
          this.messageErreur = "Image not cropped";
          alert("Votre session a été crée avec succès avec le fichier que vous avez uploadé");
          this.router.navigate(['/presentations']);
          //console.log(this.messageErreur);
        } else {
          this.messageErreur = "Image cropped" + this.id;
          alert("Votre session a été crée avec succès avec le fichier que vous avez croppé");
          //console.log(this.messageErreur);
          this.router.navigate(['/presentations']);
        }
      },
      err => {
        console.log(err);
      });

      this.ng4LoadingSpinnerService.hide();
  }
  /*Fin d l'enregistrement et envoie des coordonnées de l'image croppé*/

  /******* FIN RECUPERATION DE L'IMAGE ********/

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      //console.log("a");
      that.cropper.setImage(image);
      //console.log("ICI" + image.src);
    };
    myReader.readAsDataURL(file);
  }

  /********************PARTIE FORMULAIRE ********************** */
  model: any = {};
  form: FormGroup;
  loading: boolean = false;
  messageErreur;

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

  refresh() {
    console.log("Refresh");
    this.router.navigate(["/newsession?refresh=1"]);
  }
  showModal: boolean = false;

  closeModal() {
    console.log("CLICK CLICK");
    alert("Votre session a été crée avec succès avec le fichier que vous avez uploadé");
    this.router.navigate(['/presentations']);
  }


  loader() {
    console.log("LOADER" + !this.showModal);
    return !this.showModal;
  }

  async onSubmit(f: NgForm) {
    this.ng4LoadingSpinnerService.show();
    var that = this;
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let body = new FormData();
    body.append('nom', this.model.titre);
    body.append('date', this.model.date);
    body.append('uploadFile', this.form.get('uploadFile').value);
    let options = new RequestOptions({ headers: headers });
    let path = myGlobals.prefix + "session/creer";

    this.http.post(path, body, options)
      .subscribe(
      res => {
        let token = res.json();
    
        if (token.result == "session non crée") {
          this.ng4LoadingSpinnerService.hide();
          this.create = false;
          this.messageErreur = "Impossible de créer la session, veuillez réessayer";
          alert(this.messageErreur);
          this.load();
         
        } else {
          this.messageErreur = "Votre session a été crée avec succès";
          this.create = true;
          console.log(this.messageErreur);
          var splitted = token.result.split(" ", 3);
          console.log("SPLIT" + splitted);
          this.getImg(splitted);
        }
      },
      err => {
        //this.refresh();
        console.log(err);
        this.load();
        return;
        //console.log("BLA" + err.json());
      }
      );
    //console.log("END  SUB");
  }


  load() {
    location.reload()
  }

  async getImg(splitted) {
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    this.id = Number(splitted);
    let path = myGlobals.prefix + "session/masession/img/";

    await this.http.get(path + this.id, options)
      .subscribe(
      async res => {
        let token = res.url;
        console.log(token);
        var image: HTMLImageElement = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = token;
        image.addEventListener('load', (data) => {
          this.cropper.setImage(image);
        });
        //await this.sleep(8000);
        this.ng4LoadingSpinnerService.hide();
        this.showModal = true;
      },
      err => {
        //this.loading = false;
        this.ng4LoadingSpinnerService.hide();
        console.log(err);
        return;
      });
  }

  ngOnInit() { }
}
