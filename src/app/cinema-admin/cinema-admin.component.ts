import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { HallStyle } from './cinema-admin-models'
import { Seat, /*SeatCategory*/ } from '../seat/seat-model'
import { EditSeatComponent } from './edit-seat/edit-seat.component';
//import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-cinema-admin',
  templateUrl: './cinema-admin.component.html',
  styleUrls: ['./cinema-admin.component.scss'],
  providers: [DialogService]
})

export class CinemaAdminComponent implements OnInit{

  //ширина зала у.е.
  hallWidth: number = 16
  //длина зала у.е.
  hallHeight: number = 10
  //масштаб, ширина и высота одной клетки
  hallScale: number = 50

  scale: number = this.hallScale

  hallWidthCount: number[] = []
  hallHeightCount: number[] = []

  //private gridWidth: number = this.hallWidth
  //private gridHeight: number = this.hallHeight
  //сранит реальные ширину и высоту 

  //depricated
  styleHall: HallStyle = { height: "", width: ""}

  styleElem: HallStyle = { height: "", width: ""}
  buttonContainerStyle: HallStyle = { height: "", width: ""}
  /*@ViewChild('adminHall')
  private adminHall!: ElementRef*/

  //elemAction!: MenuItem[]
  seatWidth = 1
  formSeatWidth = 1

  seat: Seat = {
    x: 4,
    y: 4,
    price: 150,
    //category: SeatCategory.FREE
  }

  seats: Seat[] = []

  private selectedSeats: Seat[] = []

  constructor(public dialogService: DialogService) { 
    this.generateSeats()
    
    this.setHeightCount()
    this.setWidthCount()
  }

  show(seat: Seat) {
    const ref = this.dialogService.open(EditSeatComponent, {
      data: {
        seat
      },
      header: 'Edit seat',
      width: '70%',
    })

    ref.onClose.subscribe((data: any) => {
      if (data.isDelete) {
        const index = this.seats.indexOf(seat)
        this.seats.splice(index, 1)
      } else {
        //seat.x = data.x
        //seat.y = data.y
        //seat.category = data.category
        console.log(data)
        const newSeat = {
          x: data.x,
          y: data.y,
          category: data.category
        }
        //console.log(newSeat)
        const index = this.seats.indexOf(seat)
        this.seats.splice(index, 1)
        this.seats = this.seats.concat(newSeat)
        //this.updateState()
      }
    })
  }

  ngOnInit(): void {
    this.setStyle()
    //this.adminHallRef = document.getElementById("admin-hall")
    /*this.elemAction = [{
      label: "Добавить место",
      command: (event) => {
        console.log(event.originalEvent)
        //console.log(event.item)
        //const elem = event.originalEvent.target
      }
    }]*/
  }

  /*ngAfterViewChecked(): void {
    console.log(this.adminHall.nativeElement.offsetWidth)
  }*/
  private setStyle() {
    //высота на 20% больше ширины
    this.styleHall = {
      width: `${this.hallWidth * this.hallScale}px`,
      height: `${this.hallHeight * (this.hallScale + Math.round(this.hallScale * 0.2))}px`
    }

    this.styleElem = {
      width: `${this.hallScale}px`,
      height: `${this.hallScale + Math.round(this.hallScale * 0.2)}px`
    }

    this.buttonContainerStyle =  {
      width: `${this.hallScale}px`,
      height: `${this.hallScale * 2}px`
    }
  }

  updateState() {
    //this.gridWidth = this.hallWidth
    //this.gridHeight = this.hallHeight

    //если изменили ширину сидений, то генерируем новый набор сидений
    if (this.formSeatWidth !== this.seatWidth) {
      this.seatWidth = this.formSeatWidth
      this.generateSeats()
      return 
    }

    this.setStyle()
    this.scale = this.hallScale
    this.setWidthCount()
    this.setHeightCount()
    //this.generateSeats()
  }
  
  private setHeightCount() {
    console.log("height")
    this.hallHeightCount = []
    for (let i = 0; i < this.hallHeight; i++) {
      this.hallHeightCount.push(i)
    }
  }

  private setWidthCount() {
    console.log("width")
    this.hallWidthCount = []
    for (let i = 0; i < this.hallWidth; i++) {
      this.hallWidthCount.push(i)
    }
  }

  generateSeats() {
    const seats: Seat[] = []
    //i это координата
    for (let i = 1; i <= this.hallHeight - this.seatWidth + 1; i += this.seatWidth) {
      seats.push(...this.generateRowSeats(1, this.hallWidth, i))
    }
    this.seats = seats
  }

  private generateRowSeats(xFrom: number, xTo: number, y: number): Seat[] {
    const seats: Seat[] = []
    for (let i = xFrom; i <= xTo - this.seatWidth + 1; i += this.seatWidth) {
      seats.push({
        x: i,
        y,
        price: 150,
        //category: SeatCategory.FREE
      })
    }
    return seats
  }

  private generateColumnSeats(yFrom: number, yTo: number, x: number): Seat[] {
    const seats: Seat[] = []
    for (let i = yFrom; i <= yTo; i += this.seatWidth) {
      seats.push({
        x,
        y: i,
        price: 150,
        //category: SeatCategory.FREE
      })
    }
    return seats
  }

  click(seat: Seat): void {
    console.log("click")
    const indexSeat = this.selectedSeats.indexOf(seat)
    if (indexSeat === -1) {
      this.seats.push(seat)
    } else {
      this.seats.splice(indexSeat, 1)
    }
  }

  deleteRow(index: number): void {
    const coordinate = index + 1
    this.seats = this.seats.filter(seat => seat.y !== coordinate)
  }

  addRow(index: number): void {
    const coordinate = index + 1

    //проверяем есть ли рядом другие места
    const haveRow = this.seats.find(
      seat => seat.y < coordinate + this.seatWidth && seat.y > coordinate - this.seatWidth
    )

    if (!haveRow) {
      console.log("add row")
      this.seats = this.seats.concat(this.generateRowSeats(1, this.hallWidth, coordinate))
    } else {
      console.log("no add row")
    }
  }

  deleteColumn(index: number): void {
    const coordinate = index + 1
    this.seats = this.seats.filter(seat => seat.x !== coordinate)
  }

  addColumn(index: number): void {
    const coordinate = index + 1
    //проверяем есть ли рядом другие места
    const haveRow = this.seats.find(
      seat => seat.x < coordinate + this.seatWidth && seat.x > coordinate - this.seatWidth
    )

    if (!haveRow) {
      console.log("add row")
      this.seats = this.seats.concat(this.generateColumnSeats(1, this.hallHeight, coordinate))
    } else {
      console.log("no add row")
    }
  }

  addElem(i: number, j: number): void {
    this.seats.push({
      x: j,
      y: i,
      price: 150,
      //category: SeatCategory.FREE
    })
  }
}
