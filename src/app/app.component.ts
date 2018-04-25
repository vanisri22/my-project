import { Component } from '@angular/core';
import * as d3 from 'd3';
import { AgWordCloudModule, AgWordCloudData } from 'angular4-word-cloud';
import * as myGlobals from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'app';
  radius = 10;
  data = myGlobals.Data;
  constructor() {
    console.log("HERE --> " + myGlobals.Data + ", " );
    myGlobals.Data.data += " Hello";
  }


  
  /* wordData: Array<AgWordCloudData> = [
    { size: 1000, text: 'vitae' },
    { size: 1000, text: 'amet' },
    { size: 1000, text: 'sit' },
    { size: 1000, text: 'eget' },
    { size: 1000, text: 'quis' },
    { size: 1000, text: 'sem' },
    { size: 1000, text: 'massa' },
    { size: 1000, text: 'nec' },
    { size: 1000, text: 'sed' },
    { size: 1000, text: 'semper' },
    { size: 1000, text: 'scelerisque' },
    { size: 1000, text: 'egestas' },
    { size: 1000, text: 'libero' },
    { size: 1000, text: 'nisl' },
    { size: 1000, text: 'odio' },
    { size: 1000, text: 'tincidunt' },
    { size: 1000, text: 'vulputate' },
    { size: 1000, text: 'venenatis' },
    { size: 1000, text: 'malesuada' },
    { size: 1000, text: 'finibus' },
    { size: 1000, text: 'tempor' },
    { size: 1000, text: 'tortor' },
    { size: 1000, text: 'congue' },
    { size: 1000, text: 'possit' },
  ];
  

  options = {
    settings: {
     
    },
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    labels: false, // false to hide hover labels
    
  };*/

}
