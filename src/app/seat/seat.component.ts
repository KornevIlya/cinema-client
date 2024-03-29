import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Seat, /*SeatCategory,*/ SeatStyle } from './seat-model';
//import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss']
})

export class SeatComponent implements OnInit, OnChanges, AfterViewInit {

  //не обязательное поле
  @Input("width") seatWidth: number = 1
  @Input() seat!: Seat
  @Input("scale") seatScale!: number
  @Input() isSelected: boolean = false
  @Output() setElem = new EventEmitter<HTMLElement | null>()

  style: SeatStyle
  innerStyle: any

  @ViewChild('seatRef')
  private seatRef!: ElementRef

  constructor() {
    this.style = {
      height: "",
      width: "",
      left: "",
      top: "",
    }
    this.innerStyle = {height: "", width: ""}
  }

  ngOnInit(): void {
    this.updateStyle()
  }

  ngOnChanges() {
    //console.log("onchange")
    this.updateStyle()
  }

  ngAfterViewInit() {
    this.setElem.emit(this.seatRef.nativeElement)
  }

  updateStyle() {
    //console.log(this.seatWidth)
    //длина элемента на 20% больше ширины
    const del = Math.round(this.seatScale * 0.2)

    const left = (this.seat.x - 1) * this.seatScale
    const top = (this.seat.y - 1) * (this.seatScale + del)

    const innerSize = Math.round(this.seatScale * 0.8)
    const innerHeight = innerSize * this.seatWidth
    let innerWidth // = innerSize * this.seatWidth + (this.seatScale * (this.seat.type.countSeat - 1))

    if(this.seat.type.countSeat === 1) {
      innerWidth = innerSize * this.seatWidth
    } else {
      innerWidth = innerSize * this.seatWidth + (this.seatScale * (this.seat.type.countSeat - 1) * this.seatWidth)
    }

    this.style = {
      height: `${innerHeight}px`,
      width: `${innerWidth}px`,
      left: `${left}px`,
      top: `${top}px`,
    }
  }
  
  /*select(event: any): void {
    console.log("select")
    if (event.ctrlKey) {
      if(!this.isSelect) {
        this.seatRef.nativeElement.style.backgroundColor = "green"
      } else {
        this.seatRef.nativeElement.style.backgroundColor = ""
      }
      this.isSelect = !this.isSelect
    }
  }*/
}
