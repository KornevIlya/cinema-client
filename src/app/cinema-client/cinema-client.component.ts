import { Component, OnInit } from '@angular/core';

import { PLACES } from './mock-places';
import { Place } from './place';

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
  bronnedPlace?: Place;
 //bronnedVip?: Vip;

  places = PLACES
  placesStyle: any = []
  scale = 50
  containerStyle = {
    width: "500px",
    height: "500px"
  }
  constructor() {
    this.places.forEach(elem => {
      this.placesStyle.push({
        top: `${elem.y * this.scale}px`,
        left: `${elem.x * this.scale}px`,
        width: `${this.scale}px`,
        height: `${this.scale}px` 
      })
    })
  }

  ngOnInit(): void {
  }
  onBrone(place: Place): void {
    this.bronnedPlace = place;
    this.bronnedPlace.brone = !this.bronnedPlace.brone;
    this.count += this.bronnedPlace.cost;
    this.bronnedPlace.cost *= -1;
    }
  //    onBroneVip(vip: Vip): void {
  //  this.bronnedVip = vip;
  //  this.count += this.bronnedVip.cost;
   // this.bronnedVip.brone = !this.bronnedVip.brone;
  //  this.bronnedVip.cost *= -1;
  //  }
     infos(place: Place): void {
    this.check1 = true;
    this.bronnedPlace = place;
    }
    infosOff(place: Place): void {
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
