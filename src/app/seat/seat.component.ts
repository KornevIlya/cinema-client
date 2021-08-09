import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Seat, /*SeatCategory,*/ SeatStyle } from './seat-model';
//import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss']
})

export class SeatComponent implements OnInit, OnChanges {

  //не обязательное поле
  /*@Input("width") seatWidth: number = 1
  //не обязательное поле
  @Input("height") seatHeight: number = 1


  @Input("scale") seatScale!: number
  
  @Input() x!: number
  @Input() y!: number

  @Input() price: number = 0*/

  //не обязательное поле
  @Input("width") seatWidth: number = 1
  @Input() seat!: Seat
  @Input("scale") seatScale!: number

  style: SeatStyle
  innerStyle: any
 // selectSeatCategory!: MenuItem[]
  //private selectedItem: SeatCategory | null = null

  //private isSelect: boolean = false
 // private lastBackgroundColor: string = ""

  constructor() {
    this.style = {
      height: "",
      width: "",
      left: "",
      top: "",
      //backgroundColor: ""
    }
    this.innerStyle = {height: "", width: ""}
  }

  ngOnInit(): void {
    
    this.updateStyle()

    /*this.selectSeatCategory = [{
      label: this.createTemplate("Место свободно", "free"),
      escape: false,
      command: () => {
        this.seat.category = SeatCategory.FREE
        this.updateStyle()
      }
    }, {
      label: this.createTemplate("Место забронировано", "blocked"),
      escape: false,
      command: () => {
        this.seat.category = SeatCategory.BLOCKED
        this.updateStyle()
      }
    }, {
      label: this.createTemplate("Место выбрано", "selected"),
      escape: false,
      command: () => {
        this.seat.category = SeatCategory.SELECTED
        this.updateStyle()
      }
    }, {
      label: this.createTemplate("Место куплено", "bougth"),
      escape: false,
      command: () => {
        this.seat.category = SeatCategory.BOUGTH
        this.updateStyle()
      }
    }, {
      label: this.createTemplate("Место не активно", "no-active"),
      escape: false,
      command: () => {
        this.seat.category = SeatCategory.NO_ACTIVE
        this.updateStyle()
      }
    }]*/
  }

  ngOnChanges() {
    console.log("onchange")
    this.updateStyle()
  }

  /*getBackgroundColor(type: SeatCategory) {
    switch(type) {
      case SeatCategory.FREE: return "cornsilk"
      case SeatCategory.BLOCKED: return "maroon"
      case SeatCategory.SELECTED: return "forestgreen"
      case SeatCategory.BOUGTH: return "dodgerblue"
      case SeatCategory.NO_ACTIVE: return "dimgrey"
      default: return "cornsilk"
    }
  }*/

  /*createTemplate(message: string, style: string): string {
    return `
      <div class="seat-sub-menu-container"> 
        <div class="seat-sub-menu-color ${style}"></div>
        <span>${message}</span>
      </div>
    `
  }*/

  updateStyle() {
    //длина элемента на 20% больше ширины
    const del = Math.round(this.seatScale * 0.2)

    const left = (this.seat.x - 1) * this.seatScale
    const top = (this.seat.y - 1) * (this.seatScale + del)

    //const height = (this.seatScale + del) * this.seatWidth
    //const width = this.seatScale * this.seatWidth

    const innerSize = Math.round(this.seatScale * 0.8)
    const innerWidth = innerSize * this.seatWidth

    this.style = {
      height: `${innerWidth}px`,
      width: `${innerWidth}px`,
      left: `${left}px`,
      top: `${top}px`,
    }

    /*this.style = {
      height: `${height}px`,
      width: `${width}px`,
      left: `${left}px`,
      top: `${top}px`,
    }*/
    
    /*const innerSize = Math.round(this.seatScale * 0.8)
    const innerWidth = innerSize * this.seatWidth
    this.innerStyle = {
      width: `${innerWidth}px`,
      height: `${innerWidth}px`
    }*/
  }

  /*selectSeat(seatRef: any) {
    console.log("click seat")
    if(!this.isSelect) {
     // seatRef.style.backgroundColor = "red"
      this.lastBackgroundColor = this.style.backgroundColor
      this.style = {
        ...this.style,
        backgroundColor: "red"
     }
    } else {
      this.style = {
        ...this.style,
        backgroundColor: this.lastBackgroundColor
     }
    }
    this.isSelect = !this.isSelect
  }*/
}
