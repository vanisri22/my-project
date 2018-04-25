import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private home : HomeComponent) { }

  ngOnInit() {
    if (this.home.getNeed() == true) {
      document.body.style.backgroundImage = 'url(' + 'https://image.freepik.com/free-photo/blackboard-texture_1205-375.jpg' + ')';
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition= "center center";
      document.body.style.backgroundAttachment=" fixed";
			document.body.style.backgroundSize=  "cover";
			document.body.style.backgroundColor=" #999";
    }
  }

}
