import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
declare const RivalTracker: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  driverData: any;
  track1: any;
  viewBox: any;
  svg: any;

  constructor() {
    this.driverData = {"-" : 0.1}
  }

  ngOnInit(): void {
    this.start();
  }

  start() {    
    var options = {
        scaling : 100,
        pathColor : '#FFFFFF',
        pathStrokeWidth : 3,
        maxPrediction : 10000,
        nodeSize : 2,
        nodeStrokeWidth : 1,
        nodeStrokeColor: "red",
        labelFont : "Arial",
        labelFontSize : "4px",
        labelColor : 'red'
    };

    this.track1 = new RivalTracker("track1","nos", this.driverData, options);
    this.track1.setNodeColor('-','red');

    this.svg = document.getElementsByTagName("svg")[0];
    this.viewBox = this.svg.viewBox.baseVal;
    //var gearDiv = document.getElementById("gear");

    this.viewBox.width = this.viewBox.width / 2;
    this.viewBox.height = this.viewBox.height / 2;

    var gears = [
      {start: 1, end: 4, gear: 2},
      {start: 5, end: 6, gear: 5},
      {start: 8, end: 10, gear: 4},
    ];

    //setInterval(this.updatePos, 50);
    interval(50).subscribe(() => {
      this.updatePos();
    });
  }

  updatePos() {
    debugger;
    console.log(typeof this.driverData);
    if (typeof this.driverData == 'undefined') return;

    if (this.driverData["-"] > 100) this.driverData["-"] = 0;
    
    this.driverData["-"] += 0.01;

    var percent = this.driverData["-"];
    //var gear = getGear(percent);
    //this.gearDiv.innerHTML = gear;

    var point = this.track1.getDriverPosition(percent);
    
    this.viewBox.x = point.x - this.viewBox.width / 2;
    this.viewBox.y = point.y - this.viewBox.height / 3;

    var angle = -90 - this.track1.getAngle(percent);
    this.svg.setAttribute('transform','rotate('+ angle +')');
    
    this.track1.updatePositions();
  }

}
