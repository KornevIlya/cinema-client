import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { HallStyle } from './cinema-admin-models'
import { Seat, SeatCategory } from '../seat/seat-model'

import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-cinema-admin',
  templateUrl: './cinema-admin.component.html',
  styleUrls: ['./cinema-admin.component.scss']
})

export class CinemaAdminComponent implements OnInit{

  //ширина зала у.е.
  hallWidth: number = 10
  //длина зала у.е.
  hallHeight: number = 10
  //масштаб, ширина и высота одной клетки
  hallScale: number = 50

  scale: number = this.hallScale

  private gridWidth: number = this.hallWidth
  private gridHeight: number = this.hallHeight
  //сранит реальные ширину и высоту 
  styleHall: HallStyle = { height: "", width: ""}

  styleElem: HallStyle = { height: "", width: ""}

  @ViewChild('adminHall')
  private adminHall!: ElementRef

  items!: MenuItem[]

  seat: Seat = {
    x: 4,
    y: 4,
    price: 150,
    category: SeatCategory.FREE
  }

  constructor() { }

  ngOnInit(): void {
    this.setStyle()
    //this.adminHallRef = document.getElementById("admin-hall")
    this.items = [{
      label: "Место свободно"
    }, {
      label: "Место забронировано"
    }, {
      label: "Место выбрано"
    }, {
      label: "Место куплено"
    }, {
      label: "Место не активно"
    }]
  }

  /*ngAfterViewChecked(): void {
    console.log(this.adminHall.nativeElement.offsetWidth)
  }*/
  setStyle() {
    this.styleHall = {
      width: `${this.hallWidth * this.hallScale}px`,
      height: `${this.hallHeight * this.hallScale}px`
    }

    this.styleElem = {
      width: `${this.hallScale}px`,
      height: `${this.hallScale}px`
    }
  }

  updateState() {
    this.gridWidth = this.hallWidth
    this.gridHeight = this.hallHeight
    this.setStyle()
    this.scale = this.hallScale
  }
  
  getHeight(): Array<number> {
    return new Array(this.gridHeight)
  }

  getWidth(): Array<number> {
    return new Array(this.gridWidth)
  }
}
