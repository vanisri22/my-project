import { Component, OnInit } from '@angular/core';
import { Pres } from '../pres';
import { PresentationService } from '../../services/presentation.service';
import { Observable } from 'rxjs/Rx';
import { HomeComponent } from '../home/home.component';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  styleUrls: ['./presentation-list.component.css']
})

export class PresentationListComponent implements OnInit {
  preList: Promise<Pres[]>;
  PRES: Pres[];
  constructor(private preService: PresentationService, private home: HomeComponent,private ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {
    //preService.ngOnInit();
    this.home.need = true;
  }

  getEmpty() {
    return this.preService.empty;
  }

  ngOnInit() {
    this.home.need = true;
    if (this.home.getNeed() == true) {
      document.body.style.backgroundImage = 'url(' + 'https://image.freepik.com/free-photo/blackboard-texture_1205-375.jpg' + ')';
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center center";
      document.body.style.backgroundAttachment = " fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundColor = " #999";
    }
    if (this.getEmpty() == false) {
      this.init();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async init(): Promise<Pres> {
    this.ng4LoadingSpinnerService.show();
   // await this.sleep(1000);
    let response = await (this.preList = this.preService.getAll());
    this.PRES = this.preService.getTab();
    this.ng4LoadingSpinnerService.hide();
    /*let i: number;
    for (i = 0; i < this.PRES.length; i++) {
      //console.log("Case in list component " + i + ":" + this.PRES[i].id + "," + this.PRES[i].nom_pres + "," + this.PRES[i].date_pres + "," + this.PRES[i].support_pres + "," + this.PRES[i].email_pres + ".");
    };*/
    return;
  }
}
