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
  styleHall: HallStyle = { height: "", width: "" } 

  styleElem: HallStyle = { height: "", width: "" }
  styleInnerElem: HallStyle = { height: "", width: "" }
  buttonContainerStyle: HallStyle = { height: "", width: "" }
  /*@ViewChild('adminHall')
  private adminHall!: ElementRef*/

  //elemAction!: MenuItem[]
  seatWidth = 2
  formSeatWidth = 2

  seat: Seat = {
    x: 4,
    y: 4,
    price: 150,
    //category: SeatCategory.FREE
  }

  seats: Seat[] = [{
    x: 4,
    y: 4
  }, {
    x: 6,
    y: 8
  }]

  private selectedSeats: Seat[] = []

  constructor(public dialogService: DialogService) { 
    //this.generateSeats()
    this.generateAllElements()
    this.setHeightCount()
    this.setWidthCount()
  }




  allElements: { height: string, width: string, top: string, left: string }[] = []

  private generateAllElements() {
    for (let i = 0; i < this.hallHeight; i++) {
      for (let j = 0; j < this.hallWidth; j++) {
        this.allElements.push({
          width: `${this.hallScale * this.seatWidth}px`,
          height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`,
          left: `${j * this.scale}px`,
          top: `${i * this.scale}px`
        })
      }
    }
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
      width: `${(this.hallWidth + 1) * this.hallScale}px`,
      height: `${this.hallHeight * (this.hallScale + Math.round(this.hallScale * 0.2))}px`
    }

    this.styleElem = {
      width: `${this.hallScale * this.seatWidth}px`,
      height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`
    }

    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth


    this.styleInnerElem = {
      width: `${innerWidth}px`,
      height: `${innerWidth}px`
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
    ///if (this.formSeatWidth !== this.seatWidth) {
    //  this.seatWidth = this.formSeatWidth
   //   this.generateSeats()
    //  return 
   // }

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
    console.log(`add row: ${index + this.seatWidth} ${this.hallHeight} `)
    if (index + this.seatWidth <= this.hallHeight) {
      const haveRow = this.seats.find(
        //проверяем есть ли рядом другие места
        seat => seat.y < coordinate + this.seatWidth && seat.y > coordinate - this.seatWidth
      )
  
      if (!haveRow) {
        console.log("add row")
        this.seats = this.seats.concat(this.generateRowSeats(1, this.hallWidth, coordinate))
      } else {
        console.log("no add row")
      }
    }
   
  }

  deleteColumn(index: number): void {
    const coordinate = index + 1
    this.seats = this.seats.filter(seat => seat.x !== coordinate)
  }

  addColumn(index: number): void {
    const coordinate = index + 1
    console.log(`add column: ${index + this.seatWidth} ${this.hallWidth} `)
    if (index + this.seatWidth <= this.hallWidth) {
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
  }

  addElem(i: number, j: number): void {
    this.seats.push({
      x: j,
      y: i,
      price: 150,
      //category: SeatCategory.FREE
    })
  }

  /* drag and drop */

  private draggableElemIndex: number = -1

  onDrop(elem: any, i: number) {
    console.log("drop")
    const dropppable = this.allElements[i]
    const coordinateX = parseInt(dropppable.left) / this.scale + 1
    const coordinateY = parseInt(dropppable.top) / (this.scale + Math.round(this.scale * 0.2)) + 1

    /*if (coordinateX + this.seatWidth - 1 > this.hallWidth || coordinateY + this.seatWidth - 1 > this.hallHeight) {
      elem.children[0].backgroundColor = ""
      elem.style.zIndex = ""
      return 
    }*/

    const haveCollision = this.seats.find((seat, index)=> {
    
      if (index === this.draggableElemIndex) return false

      if (seat.x < coordinateX + this.seatWidth && seat.x > coordinateX - this.seatWidth)
        if(seat.y < coordinateY + this.seatWidth && seat.y > coordinateY - this.seatWidth) {
          return true
        }
      return false
    })

    if (!haveCollision) {
      if (this.draggableElemIndex !== -1) {
        this.seats[this.draggableElemIndex] = {
          x: coordinateX,
          y: coordinateY
        }
      }
    }
    elem.children[0].style.backgroundColor = ""
    elem.style.zIndex = ""
  }

  onDragEnter(elem: any) {
    elem.children[0].style.backgroundColor = "red"
    elem.style.zIndex = "3"
  }

  onDragLeave(elem: any) {
    elem.children[0].style.backgroundColor = ""
    elem.style.zIndex = ""
  }

  onDragStart(index: number) {
    console.log("on drag statt")
    this.draggableElemIndex = index
  }
  onDragEnd() {
    this.draggableElemIndex = -1
    console.log("on drag end")
  }

  /* end drag and drop*/
}
