import { Component, OnInit } from '@angular/core';
import { Pres } from '../pres';
import { PresentationService } from '../../services/presentation.service';
import { Observable } from 'rxjs/Rx';



@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  styleUrls: ['./presentation-list.component.css']
})
export class PresentationListComponent implements OnInit {
  preList: Promise<Pres[]>;
  PRES: Pres[];
  constructor(private preService: PresentationService) {
    //preService.ngOnInit();
  }

  ngOnInit() {
    this.init();

    
  }

  async init(): Promise<Pres> {
    let response = await (this.preList = this.preService.getAll());
    this.PRES = this.preService.getTab();
    let i: number;
    for (i = 0; i < this.PRES.length; i++) {
      console.log("Case in list component " + i + ":" + this.PRES[i].id+ "," + this.PRES[i].nom_pres + "," + this.PRES[i].date_pres + "," + this.PRES[i].support_pres + "," + this.PRES[i].email_pres + ".");
    };
    return;
  }



}





    //this.preService.ngOnInit();
    //console.log("List 1");




    //console.log("List 2" + this.preService.getSize());
    //let i: number;
    /*for (i = 0; i < this.preList.length; i++) {
      console.log("Case in list component " + i + ":" + this.preList[i].id_pres + "," + this.preList[i].nom_pres + "," + this.preList[i].date_pres + "," + this.preList[i].support_pres + "," + this.preList[i].email_pres + ".");
    };*/


