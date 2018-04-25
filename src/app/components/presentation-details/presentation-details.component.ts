import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Pres } from '../pres';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationService } from '../../services/presentation.service';
import { Http, Headers, RequestOptions, Response, HttpModule } from '@angular/http'
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { HomeComponent } from '../home/home.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { MonProfilComponent } from '../mon-profil/mon-profil.component';
import { Postit } from '../postit';
import { take } from 'rxjs/operator/take';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import * as myGlobals from '../../globals';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.css']
})
export class PresentationDetailsComponent implements OnInit, OnDestroy {
  title = 'app';
  ticks = 0;

  IDPOST: number;
  CONTENTPOST: string;
  okChange: boolean;
  monSet = new Set();

  /*pour post it */
  nom: string;
  prenom: string;
  static _id: number = 1;
  /*fin pour post it */

  /* pour requete get au serveur*/
  pre: Pres;
  sub: any;
  pdfSrc: any;
  msg: any;
  messageErreur: any;
  /*fin pour requete get au serveur*/

  /*pour création des div(s) correspondant au post it */
  model: any = {};
  checkboxValue: boolean = false;
  //postIts: Element[] = [];
  /*fin pour création des div(s) correspondant au post it */

  /*socket de communication avec le serveur*/
  s: WebSocket;
  /*fin socket de communication avec le serveur*/

  /*QR Code de la présentation */
  qrcode: any;
  /*Fin QR Code de la présentation*/

  myId: Number;

  myIdTab = new Array();
  /*******CONSTRUCTOR ********/
  constructor(private route: ActivatedRoute, private presServ: PresentationService, private router: Router,
    private http: Http, private home: HomeComponent,
    private profil: MonProfilComponent, private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {
    /*permettre de récuperer les informations du propriètaire de la présentation plus facilement*/
    profil.ngOnInit();
    /*fin récupération des informations du propriètaire*/
  }
  /******* FIN CONSTRUCTOR ********/

  isIn(id) {
    for (let i = 0; i < this.myIdTab.length; i++) {
      console.log(id + " = " + this.myIdTab[i])
      if (id == this.myIdTab[i]) {
        return true;
      }
    }
    return false;
  }

  /********INIT*******/
  async ngOnInit() {
    this.ng4LoadingSpinnerService.show();

    /*Récupération de l'objet correspondant à la présentation*/
    this.sub = this.route.params.subscribe((param) => {
      console.log("IN THIS SUB");
      let id = Number.parseInt(param['id']);
      //await this.waiting(id);
      this.myId = id;
    });
    /* fin Récupération de l'objet correspondant à la présentation*/

    this.myIdTab = await this.presServ.getSet();
    console.log(">>><<<" + this.myId);
    if (this.isIn(this.myId) == false) {
      alert("Vous n'êtes pas autorisé à accéder à cette page!.")
      this.router.navigate(['/presentations']);
      return;
    }

    /*Mise en place de la socket vers le serveur*/
    var self = this;
    let ws = myGlobals.webPrefix + "postitsocket"
    this.s = new WebSocket(ws);
    this.s.onopen = function (event) {
      console.log("IN ONOPEN");
      self.s.send(localStorage.getItem("currentUser"));
      self.s.send(self.myId + " " + JSON.stringify({ "admin": true }));
    }
    /* Fin de la mise en place de la socket vers le serveur*/

    /*Envoie toutes les 5 secondes d'un message "ping" au serveur via la socket de communication*/
    let timer = Observable.timer(0, 5000);
    timer.subscribe(t => this.tickerFunc(t, this.s));
    /*Fin envoie toutes les 5 secondes d'un message "ping" au serveur via la socket de communication*/

    /*Récupération de l'image de la présentation : requete au serveur*/
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    let path = myGlobals.prefix + "session/masession/img/";
    this.http.get(path + this.myId, options)
      .subscribe(
        res => {
          let token = res.url;
          console.log(token);
          this.pdfSrc = token;
          this.home.need = false;
          console.log("PDF SRC " + this.pdfSrc);
          /*Mise en place de l'image uploader par le propriètaire en background*/
          if (this.home.need == false) {
            document.body.style.backgroundImage = 'url(' + this.pdfSrc + ')';
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "contain";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundAttachment = "fixed"
            document.body.style.backgroundColor = " #242424";
            document.body.style.height = "95vh";
            document.body.style.width = "100vw";
          }
          /*Fin de la mise en place de l'image uploader par le propriètaire en background*/

        },
        err => {
          alert("Nous avons rencontré un problème lors du chargement de votre présentation, veuillez réessayer .")
          this.router.navigate(['/presentations']);
          console.log(err);
          return;
        });
    /*Fin de la récupération de l'image de la présentation : requete au serveur*/
    this.getAllPostIt();
    this.ng4LoadingSpinnerService.hide();

    /* A l'écoute */
    this.s.onmessage = function (event) {
      console.log(">>>>>>>>>>> A l'écoute" + event.data + " <<<<<<<<<<<<<<<<<<<<<<<<<");
      if (event.data.startsWith("create") == true) {
        console.log("Création venant d'un autre participant");
        var s = event.data.substring(7);
        var post: Postit = new Postit();
        post.id = JSON.parse(s).id;
        console.log("ID >> " + post.id);
        post.contenu = JSON.parse(s).contenu;
        post.anonyme = JSON.parse(s).anonyme;
        post.auteur = JSON.parse(s).prenom;
        post.top = JSON.parse(s).top;
        post.left = JSON.parse(s).left;
        post.recup = true;
        /********* TO CHECK SI LE MIEN OU PAS MOBILE******/
        self.divAdding(post, false);
        /********* TO CHECK SI LE MIEN OU PAS ******/
      }
      else if (event.data.startsWith("remove") == true) {
        console.log("Suppression venant d'un autre");
        var s = event.data.substring(7);
        console.log(s);
        var id = JSON.parse(s).id;
        self.afficheSet();
        if (self.monSet.has(id)) {
          self.monSet.delete(id);
        }
        document.getElementsByClassName("postItSet")[0].removeChild(document.getElementById("mydiv" + id));
      }
      else if (event.data.startsWith("" + self.myId) == true) {
        var a = String(self.myId);
        console.log("Modification de position");
        var s = event.data.substring(a.length + 1);
        /*"id_pres": this.myId, "anonyme": this.model.choice ? true : false, "contenu": this.model.contenu, "top": 0, "left": 0 */
        var post: Postit = new Postit();
        post.id = JSON.parse(s).id;
        post.top = JSON.parse(s).top;
        post.left = JSON.parse(s).left;
        post.contenu = JSON.parse(s).contenu;
        self.CONTENTPOST = post.contenu;
        var elmnt = document.getElementById("mydiv" + post.id);
        var elt = document.getElementById("text" + post.id);
        elt.textContent = post.contenu;
        elmnt.style.top = post.top * 100 + "%";
        elmnt.style.left = post.left * 100 + "%";
        console.log("FIN");
      }
      else if (event.data.startsWith("block")) {
        var s = event.data.substring(6);
        self.checkboxValue = JSON.parse(s).block;
      }
      else if (event.data.startsWith("pong")) {
        console.log("J'ai recu un pong venant du serveur");
      }
      else if (JSON.parse(event.data).id != undefined) {
        console.log("J'ai recu un message pour l'id = " + JSON.parse(event.data).id);
        var postit: Postit = new Postit();
        postit.id = JSON.parse(event.data).id;
        postit.contenu = self.model.contenu;
        postit.auteur = self.profil.user.prenom;
        postit.anonyme = false;
        postit.top = 0;
        postit.left = 0;
        self.monSet.add(postit.id);
        self.divAdding(postit, true);
      }
      else if (JSON.parse(event.data).success == true) {
        console.log("Tout va bien");
      }

      /* Fin A l'écoute */
    };

    this.getQRcode();
  }
  /******** FIN INIT ********/

  tickerFunc(tick, socket) {
    if (socket.readyState === socket.OPEN) {
      console.log(this);
      this.ticks = tick;
      this.s.send("ping ");

    }
  }
  getCheckbox() {
    return this.checkboxValue;
  }

  desactivation() {
    this.checkboxValue = !this.checkboxValue;
    console.log("je clique = " + this.checkboxValue);
    this.s.send("block " + JSON.stringify({ "block": this.checkboxValue, "id_pres": this.myId }));

    var d = document.getElementsByClassName("card");
    var i = 0;
    for (i = 0; i < d.length; i++) {
      var ii = Number(d[i].getAttribute("id").substring(5));
      console.log("IID" + ii);
      if (!this.monSet.has(ii)) { }
    }
  }

  /*Gestion de la redirection vers la page des presentations AVEC fermeture de la socket de communication*/
  routing() {
    this.s.close();
    console.log("Close socket");
    this.router.navigate(['/presentations']);
  }
  /*Fin de gestion de la redirection vers la page des presentations AVEC fermeture de la socket de communication*/

  /*Méthode sleep */
  sleep(ms) {
    console.log("SLEEP");
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /*Fin méthode sleep */

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  /******* RECUPERATION DE TOUS LES POST IT D'UNE SESSION **********/
  getAllPostIt() {
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    let path = myGlobals.prefix + "postit/session/";

    this.http.get(path + this.myId, options)
      .subscribe(
        res => {
          let token = res.json();
          if (token.length > 0) {
            var i: number = 0;
            for (i = 0; i < token.length; i++) {
              var po = token[i][0];
              var p: Postit = new Postit();
              console.log("POST IT RECUPERE : " + po.id_postit + " " + po.contenu + " " + po.anonyme + " " + po.email + " " + po.posX + " " + po.posY);
              p.id = po.id_postit;
              p.contenu = po.contenu;
              p.anonyme = po.anonyme;
              p.auteur = token[i][2];
              p.top = po.posY;
              p.left = po.posX;
              p.recup = true;
              console.log("Email pre" + this.profil.getEmail() + ", email recu" + po.email);
              /*Ajout du post it sur la page */
              if (po.email.localeCompare(this.profil.getEmail()) == 0) {
                console.log("TRUE");
                /********* TO CHECK SI LE MIEN OU PAS ******/
                this.divAdding(p, true);
                /********* TO CHECK SI LE MIEN OU PAS ******/
                this.monSet.add(p.id);

              }
              else {
                console.log("FALSE");
                /********* TO CHECK SI LE MIEN OU PAS ******/
                this.divAdding(p, false);
                /********* TO CHECK SI LE MIEN OU PAS ******/
              }

            }
          }
        },
        err => {
          console.log(err);
        });
  }
  /******* FIN RECUPERATION DE TOUS LES POST IT D'UNE SESSION **********/

  afficheSet() {
    console.log("Je vais afficher" + this.monSet.size);
    var monTableau = Array.from(this.monSet);
    for (let item of monTableau) console.log(item);
  }


  /*********FONCTION RECUPERANT LE QR CODE  ***********/
  getQRcode() {
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem("currentUser"));
    let options = new RequestOptions({ headers: headers });
    let path = myGlobals.prefix + "session/qrcode/";

    this.http.get(path + this.myId, options)
      .subscribe(
        res => {
          let token = res.url;
          this.qrcode = token;
          console.log(token);
          document.getElementById("qr1").setAttribute("src", this.qrcode);
          document.getElementById("qr1").style.position = "center";
        },
        err => {
          console.log(err);
        });
  }
  /********* FIN FONCTION RECUPERANT LE QR CODE  ***********/

  /********** ENVOIE DE DEMANDE CREATION DE POST IT AU SERVEUR **************/
  async addPostIt() {
    var body = "create ";
    body += JSON.stringify({ "id_pres": this.myId, "anonyme": false, "contenu": this.model.contenu, "top": 0, "left": 0 });
    console.log("BODY: " + body);
    this.s.send(body);
  }
  /********** FIN ENVOIE DE DEMANDE CREATION DE POST IT AU SERVEUR **************/

  /******* AJOUT DE DIV POUR LE POST IT SUR LA PAGE ********/
  divAdding(p: Postit, mine: boolean) {
    /*recupération de la div POST IT SET */
    var principale = document.getElementsByClassName("postItSet")[0];
    //this.profil.getInfo();
    var self = this;
    /*var necessaire pour la création de post it */
    // var id1: number = PresentationDetailsComponent._id++;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var X = 0, Y = 0, X1 = 0, Y1 = 0;
    /*fin var necessaire pour la création de post it */

    /*Creation de div card */
    var card = document.createElement('div');
    card.className = "card";
    card.setAttribute("id", "mydiv" + p.id);

    /*Fin de la creation de div DRAG */

    var outer = document.createElement("div");
    outer.setAttribute("id", "outer");


    var span = document.createElement('button');
    span.className = "button";
    span.setAttribute("id", "close1" + p.id)
    span.textContent = "\u26CC";
    //span.style.width = "10%"
    span.style.top = "0%";
    span.style.left = "0%";
    span.style.position = "absolute";
    span.style.backgroundColor = "transparent";

    var inner1 = document.createElement("div");
    inner1.setAttribute("class", "inner");
    inner1.appendChild(span);
    outer.appendChild(inner1);


    span.addEventListener("click", function () {
      /*supprimer du tableau postIts*/

      /*fin supprimer du tableau postIts*/

      /*Prevenir le serveur qu'un post it a été supprimé*/
      var body = "remove ";
      body += JSON.stringify({ "id": p.id, "id_pres": self.myId });
      console.log("SUPPRESSION" + body);

      if (self.monSet.has(p.id)) {
        self.monSet.delete(p.id);
        self.afficheSet();
      }


      self.s.send(body);
      /*Fin prevenir le serveur qu'un post it a été supprimé*/

      /*Suppression du post it du DOM de la page*/
      document.getElementsByClassName("postItSet")[0].removeChild(document.getElementById("mydiv" + p.id));
      /*Fin suppression du post it du DOM de la page*/
    });



    if (mine) {
      var span2 = document.createElement('button');
      span2.className = "button";
      span2.setAttribute("id", "modify1" + p.id);
      span2.textContent = "\u270E";
      span2.style.position = "absolute";
      span2.style.top = "0%";
      span2.style.right = "0%";
      span2.style.backgroundColor = "transparent"
      span2.setAttribute("data-toggle", "modal");
      span2.setAttribute("data-target", "#Modif");

      var inner2 = document.createElement("div");
      inner2.setAttribute("class", "inner");
      outer.appendChild(inner2);
      inner2.appendChild(span2);
      span2.addEventListener("click", function () {
        console.log("CLIIIIIICk" + p.id);
        self.IDPOST = p.id;
        console.log("ID POST= " + self.IDPOST + "P ID=" + p.id);
        self.CONTENTPOST = p.contenu;
      });
    }

    /*card.appendChild(span);
    card.appendChild(span2);*/

    card.appendChild(outer);
    console.log(">>>mydiv" + p.id);

    /*Creation de div cardBlock */
    var cardBlock = document.createElement('div');
    cardBlock.className = "card-block";

    /*Fin de la creation de div cardBlock */


    /*Creation de div cardTitle */
    var cardTitle = document.createElement('div');
    cardTitle.setAttribute("id", "title" + p.id);
    cardTitle.className = "card-title";
    if (p.anonyme == true) {
      cardTitle.textContent = "anonymous"
    }
    else {
      cardTitle.textContent = p.auteur + "";
    }

    /*Fin de la creation de div cardTitle */

    /*Creation de div cardText */
    var cardText = document.createElement('div');
    cardText.className = "card-text";
    cardText.setAttribute("id", "text" + p.id);
    cardText.textContent = p.contenu;
    /*Fin de la creation de div cardText */

    cardBlock.appendChild(cardTitle);
    cardBlock.appendChild(cardText);
    card.appendChild(cardBlock);


    /*Ajout de card dans le document */
    principale.appendChild(card);

    document.getElementById("mydiv" + p.id).style.top = 0 + "px";
    document.getElementById("mydiv" + p.id).style.left = 0 + "px";
    //principale.appendChild(document.createElement("br"));
    /*Fin ajout de card dans le document*/

    /*Draggable card element */
    this.dragElement(card, self, p);

    /*Ajout du style pour les elements card,cardBlock,close et card-title */
    var st = document.getElementsByTagName("style")[0];
    st.textContent = `.card {
      position:absolute ;
      
      width : 10vw;
      float: left;
      display: block;
      margin: 0 0 0  0;
      background: linear-gradient(to top, rgba(0,0,0,.05), rgba(0,0,0,.25));
      background-color: #FFFD75;
      box-shadow: 5px 5px 10px -2px rgba(33,33,33,.3);
      transform: rotate(2deg);
      transform: skew(-1deg,1deg);
      transition: transform .15s;
      cursor: move;
    }`;
    st.textContent += `.card-block { 
      color: #fff;
    }`;
    st.textContent += `.card-title{ 
      text-align: center; 
      color: blue;
      word-wrap: break-word;
    }`;
    st.textContent += `.card-text{ 
      text-align: center; 
      color: red;
      word-wrap:break-word;
    }`;

    /*Fin d'ajout du style pour les elements card,cardBlock,close et card-title */

    /*Ajout + affichage du post it dans le tableau postIts*/
    //this.postIts.push(card);
    //this.affichePostIts();
    /*Fin ajout + affichage du post it dans le tableau postIts*/
  }

  /******* FIN AJOUT DE DIV POUR LE POST IT SUR LA PAGE  ********/

  /******* AFFICHAGE DU CONTENU DU TABLEAU POST-IT'S ********/
  /*affichePostIts() {
    console.log("Tableau de post it :");
    var i: number = 0;
    for (i = 0; i < this.postIts.length; i++) {
      console.log(this.postIts[i].id + "\n");
    }
  }*/
  /******* FIN AFFICHAGE DU CONTENU DU TABLEAU POST-IT'S ********/

  /*******FONCTIONS POUR DEPLACER LES POST IT*******/
  dragElement(elmnt, self, p: Postit) {
    var top, left;
    /*Variable pour fonctions de deplacement*/
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var X = 0, Y = 0, X1 = 0, Y1 = 0;
    var initX, initY, mousePressX, mousePressY;
    /* Fin variable pour fonctions de deplacement */

    var style = window.getComputedStyle(document.body, null);

    if (p.recup) {
      elmnt.style.top = p.top * 100 + "%";
      //console.log("TOP >>" + elmnt.style.top);
      elmnt.style.left = p.left * 100 + "%";
      //console.log("LEFT >>" + elmnt.style.left);
      Y = p.top * parseInt(style.getPropertyValue("height"));
      X = p.left * parseInt(style.getPropertyValue("width"));
      elmnt.style.bottom = "auto";
      elmnt.style.right = "auto";
      console.log("left : " + elmnt.style.left + " top: " + elmnt.style.top + "Y" + Y + ", X" + X);
    }
    else { }

    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      if (self.checkboxValue == false && !self.monSet.has(p.id)) {
        console.log("IN");
        document.onmouseup = null;
        // call a function whenever the cursor moves:
        document.onmousemove = null;
      }
      else {
        e = e || window.event;
        // get the mouse cursor position at startup:
        initX = elmnt.offsetLeft;
        initY = elmnt.offsetTop;
        mousePressX = e.clientX;
        mousePressY = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.left = initX + e.clientX - mousePressX + 'px';
      elmnt.style.top = initY + e.clientY - mousePressY + 'px';
      elmnt.style.bottom = "auto";
      elmnt.style.right = "auto";

      top = ((elmnt.offsetTop - pos2) / parseInt(style.getPropertyValue("height")));
      left = ((elmnt.offsetLeft - pos1) / parseInt(style.getPropertyValue("width")));

      if (top < 0) {
        console.log("TOP < 0");
        top = 0;
      }
      if (top > 0.96) {
        console.log("TOP > 1");
        top = 0.86;
      }

      if (left < 0) {
        console.log("LEFT < 0");
        left = 0;
      }
      if (left > 0.96) {
        console.log("LEFT > 1");
        left = 0.95;
      }
      //console.log("IN DRAG, TOP = " + top + ", LEFT=" + left);
      Y = top;
      X = left;
      //console.log("Innerwidth" + window.innerWidth * left + "px, Innerheight " + window.innerHeight * top + "px top%: " + top + " left%: " + left);
      //console.log("e >>X :" + elmnt.style.left + ",Y:" + elmnt.style.top);
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      top = ((elmnt.offsetTop - pos2) / parseInt(style.getPropertyValue("height")));
      left = ((elmnt.offsetLeft - pos1) / parseInt(style.getPropertyValue("width")));
      if (top < 0) {
        console.log("TOP < 0");
        top = 0;
      }
      if (top > 0.96) {
        console.log("TOP > 1");
        top = 0.86;
      }

      if (left < 0) {
        console.log("LEFT < 0");
        left = 0;
      }
      if (left > 0.96) {
        console.log("LEFT > 1");
        left = 0.95;
      }

      elmnt.style.top = top * 100 + "%";
      elmnt.style.left = left * 100 + "%";
      Y = top;
      X = left;

      /*envoie au serveur via socket des positions du postIt*/
      var body = self.myId + " ";

      var c = document.getElementById("text" + p.id);
      p.contenu = c.textContent;
      self.CONTENTPOST = c.textContent;
      body += JSON.stringify({ "anonyme": p.anonyme, "contenu": p.contenu, "top": Y, "left": X, "id": p.id });
      console.log("DEPLACEMENT" + body);
      self.s.send(body);
      /*fin envoie au serveur via socket des positions du postIt*/
    }
  }
  /*******FIN FONCTIONS POUR DEPLACER LES POST IT*******/

  modify(f: NgForm) {
    //console.log("value = " + this.CONTENTPOST.localeCompare(this.model.contenu2) + "base = " + this.CONTENTPOST + ", new= " + this.model.contenu2);
    if (this.model.contenu2 == "undefined") {
      console.log("Aucune modification faite");
    }

    else if (this.CONTENTPOST.localeCompare(this.model.contenu2) != 0) {
      console.log("ID POST = " + this.IDPOST);
      var d1 = document.getElementById("mydiv" + this.IDPOST);
      var d = document.getElementById("title" + this.IDPOST);
      var c = document.getElementById("text" + this.IDPOST);

      var t = (d1.style.top).substring(0, (d1.style.top.length - 1));
      var t1 = (Number(t) / 100);

      var a = (d1.style.left).substring(0, (d1.style.left.length - 1));
      var a1 = (Number(a) / 100);

      var body = this.myId + " ";

      if (d.textContent.localeCompare("anonymous") == 0) {
        body += JSON.stringify({ "anonyme": true, "contenu": this.model.contenu2, "top": t1, "left": a1, "id": this.IDPOST });
      }
      else {
        body += JSON.stringify({ "anonyme": false, "contenu": this.model.contenu2, "top": t1, "left": a1, "id": this.IDPOST });
      }

      console.log("MODIFICATION " + body);
      c.textContent = this.model.contenu2;
      this.CONTENTPOST = c.textContent;
      console.log("CONTENU ========" + c.textContent);
      this.s.send(body);
    }
  }


  contentChange(event) {
    if (this.CONTENTPOST != event) {
      console.log(this.CONTENTPOST + "," + event)
      console.log('changed', event);
      this.okChange = true;
    }
    else
      this.okChange = false;
  }


  test() {
    return this.okChange;
  }
}