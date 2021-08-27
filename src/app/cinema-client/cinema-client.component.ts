import { Component, HostListener, OnInit } from '@angular/core';

//import { PLACES, WIDTH, HEIGHT, SEAT_WIDTH } from './mock-places';
//import { Place } from './place';
import { Seat, SeatType, Single, Sofa } from '../seat/seat-model';
import { CinemaServiceService } from '../cinema-service.service';
import { Hall } from '../cinema-model';

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

  places: Seat[] = []
  placesStyle: any = []
  placesInnerStyle: any = []
  scale = 40
  width: number = 0//= WIDTH
  height: number = 0 //= HEIGHT
  seatWidth: number = 0 //= SEAT_WIDTH
  containerStyle = {
    width: "500px",
    height: "500px"
  }
  tempoStyle = {
    height: ""
  }
  positionInfo = {
    top: "",
    left: ""
  }
  mainStyle = { width: "" }

  constructor(private cinemaService: CinemaServiceService) {
    this.cinemaService
      .get()
      .subscribe((hall: Hall) => {
        this.width = hall.width
        this.height = hall.height
        this.seatWidth = hall.seatWidth
        this.places = hall.seats.map(seatHall => { return {
          x: seatHall.x,
          y: seatHall.y,
          brone: seatHall.brone,
          closet: seatHall.closet,
          number: seatHall.number,
          price: seatHall.price,
          row: seatHall.row,
          type: seatHall.type.countSeat === 1 ? new Single() : new Sofa(seatHall.type.countSeat)
        }})

        this.init()
      })
  }


  private init() {
    let mainWidth = this.scale * this.width
    let tempHeight = this.height

    mainWidth = mainWidth > 1350 ? mainWidth + 150 : 1350
    tempHeight = tempHeight > 180 ? tempHeight + 50 : 180
    this.mainStyle = {
      width: `${mainWidth}px`
    }

    this.scale = Math.floor(this.scale / this.seatWidth)

    this.containerStyle = {
      width: `${this.scale * this.width}px`,
      height: `${this.scale * this.height}px`
    }

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
  infos(event: MouseEvent, place: Seat): void {
    // let testo = setTimeout(()=> {
    //   this.check1 = true;
    //   this.bronnedPlace = place;
    //   this.positionInfo = {
    //     left: `${event.pageX + 15}px`,
    //     top: `${event.pageY + 15}px`
    //   } 
    // } , 500)
    this.check1 = true;
    this.bronnedPlace = place;
    this.positionInfo = {
      left: `${event.pageX + 15}px`,
      top: `${event.pageY + -30}px`,
    }
  }

  infosOff(event: MouseEvent, place: Seat): void {
    //clearTimeout(testo);
    this.check1 = !this.check1;
    this.positionInfo = {
      left: ``,
      top: ``
    }
  }
  //  infoVips(vip: Vip): void {
  // this.check2 = true;
  // this.bronnedVip = vip;
  // }

  //  infoVipsOff(vip: Vip): void {
  // this.check2 = !this.check2;
  // }
}
