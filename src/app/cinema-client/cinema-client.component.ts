import { Component, HostListener, OnInit } from '@angular/core';

import { PLACES, WIDTH, HEIGHT, SEAT_WIDTH } from './mock-places';
//import { Place } from './place';
import { Seat, SeatType } from '../seat/seat-model';

@Component({
  selector: 'app-cinema-client',
  templateUrl: './cinema-client.component.html',
  styleUrls: ['./cinema-client.component.scss']
})
export class CinemaClientComponent implements OnInit {
  count: number = 0;
  check1: boolean = true;
  check2: boolean = true;
 // vip = VIPS;
  bronnedPlace?: Seat;
 //bronnedVip?: Vip;

  places: Seat[] = PLACES
  placesStyle: any = []
  placesInnerStyle: any = []
  scale = 25
  width = WIDTH
  height = HEIGHT
  seatWidth = SEAT_WIDTH
  containerStyle = {
    width: "500px",
    height: "500px"
  }
  constructor() {
    this.places[0].type.type
    //this.mashtabe()
    this.scale = Math.floor(this.scale / this.seatWidth)
    this.places.forEach(elem => {
      this.placesStyle.push({
        top: `${((elem.y - 1/* - 0.7*/) * this.scale)}px`,
        left: `${((elem.x - 1/* - 0.85*/) * this.scale)}px`,
        width: `${this.scale * elem.type.countSeat * this.seatWidth}px`,
        height: `${this.scale * this.seatWidth}px`
      })
      this.placesInnerStyle.push({
        width: `${(this.scale * 0.8 + ((elem.type.countSeat - 1) * this.scale)) * this.seatWidth}px`,
        //height: `${this.scale}px` 
      })
    })
  }

  // @HostListener("window:resize")
  // mashtabe(): void{
  //   //console.log("resize")
  //   const widthCount = window.innerWidth - 840;
  //   const heightCount = window.innerHeight - 200;
  //   const widthScale = Math.floor(widthCount/WIDTH);
  //   const heightScale = Math.floor(heightCount/HEIGHT);
  //   this.scale = widthScale < heightScale ? widthScale : heightScale
  //   this.containerStyle = {
  //     width: `${this.scale * this.width}px`,
  //     height: `${this.scale * this.height}px`
  //   }
  // }
  ngOnInit(): void {
  }
  onBrone(place: Seat): void {
    this.bronnedPlace = place;
    this.bronnedPlace.brone = !this.bronnedPlace.brone;
    this.count += this.bronnedPlace.price;
    this.bronnedPlace.price *= -1;
  }
  //    onBroneVip(vip: Vip): void {
  //  this.bronnedVip = vip;
  //  this.count += this.bronnedVip.cost;
   // this.bronnedVip.brone = !this.bronnedVip.brone;
  //  this.bronnedVip.cost *= -1;
  //  }
     infos(place: Seat): void {
    this.check1 = true;
    this.bronnedPlace = place;
    }
    infosOff(place: Seat): void {
    this.check1 = !this.check1;
    }
    //  infoVips(vip: Vip): void {
    // this.check2 = true;
    // this.bronnedVip = vip;
    // }
   
    //  infoVipsOff(vip: Vip): void {
    // this.check2 = !this.check2;
    // }
}
