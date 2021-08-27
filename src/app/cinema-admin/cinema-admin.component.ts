import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, AfterViewChecked} from '@angular/core'

import { HallStyle, AddSeatError } from './cinema-admin-models'
import { Seat, Single, Sofa, SeatType } from '../seat/seat-model'
import { EditSeatComponent } from './edit-seat/edit-seat.component';
import { AddSeatComponent } from './add-seat/add-seat.component';
import { Side } from './add-seat/add-seat-model';
import { CinemaServiceService } from '../cinema-service.service';
import { Hall, HallSeat } from '../cinema-model';

import { DialogService } from 'primeng/dynamicdialog';


type Position = {
  x: number,
  y: number
}
type SelectedSeat = {
  element: HTMLElement //HTMLElement который перемещаем (отрисовывает Seat)
  droppable: any[] //HTMLElement | null //целевой элемент поверх которого будет наложен Seat
  //lastDroppable: any[]
  index: number //индекс элемента (позиция в массиве)
  position: Position //координаты Seat перед началом перемещения
}

type Size = {
  height: string,
  width: string
}

type Height = {
  height: string
}

type Data = {
  seat: Seat,
  elem: HTMLElement | null,
  position: Position
  size: Size,
  innerSize: Size,
  isSelected: boolean
}

type SizePosition = {
  //height: string, 
  //width: string, 
  left: string,
  top: string
}

// type SelectedRowButton = {
//   row: number,
//   style: SizePosition
// }

type CommonStyle = {
  hall: Size
  innerElem: Size,
  //buttonContainer: Size,
  //showButton: Height,
  //showButtonInner: Height[]
}

interface SelectAreaStyle {
  left: string,
  top: string,
  width: string,
  height: string
}

interface DroppableElement {
  element: HTMLElement | null
  position: Position
}

@Component({
  selector: 'app-cinema-admin',
  templateUrl: './cinema-admin.component.html',
  styleUrls: ['./cinema-admin.component.scss'],
  providers: [DialogService],
})

export class CinemaAdminComponent implements OnInit, AfterViewInit, AfterViewChecked {

  //ширина зала у.е.
  hallWidth: number = 30
  //длина зала у.е.
  hallHeight: number = 15
  //масштаб, ширина и высота одной клетки
  hallScale: number = 25

  seatWidth: number = 3
  formSeatWidth: number = 3

  sofaWidth: number = 3

  scale: number = this.hallScale

  //hallWidthCount: number[] = []
  //hallHeightCount: number[] = []

 // buttonVerticalHeight: { height: string } = { height: "" }

  style: CommonStyle = {
    hall: { height: "", width: "" },
    innerElem: { height: "", width: "" },
    //buttonContainer: { height: "", width: "" }
    //showButton: { height: "" },
    //showButtonInner: [],
  }

  //selectRowButton: SelectedRowButton[] = []

  data: Data[] = []

  @ViewChild('adminHall')
  private adminHall!: ElementRef

  //смещение родительского контейнера относительно начала документа
  private shiftContainerX: number = 0
  private shiftContainerY: number = 0

  /*  for drag and drop */

  //смещение курсора внутри перемещаемого элемента
  private shiftCursorX: number = 0
  private shiftCursorY: number = 0


  //ошибка, когда один элемент перекрывает другой
  private movableError: boolean = false
  //текущий перемещаемый элемент
  private movableSeat: HTMLElement | null = null
  //true - когда элемент перемещают
  private isMovable: boolean = false
  //выбранные элементы
  private selectedSeats: SelectedSeat[] = []
  //флажок указывает, что нужно сместить кнопку выбора ряда
  private isSelectedRow: boolean = false

  /* ------- */

  private contextMenuForSeatRef: HTMLElement | null = null
  private contextMenuForHallRef: HTMLElement | null = null

  /* for select area */

  private topBegin: number = 0
  private leftBegin: number = 0
  private isSelectArea = false
  //private selectedArea: Data[] = []


  selectAreaStyle: SelectAreaStyle = {
    height: "",
    width: "",
    top: "",
    left: ""
  }

  /* ------------------ */


  /*  droppable elements */

  //стили для элементов которые используются как droppable
  styleDroppableElements: { height: string, width: string, top: string, left: string }[] = []

  private droppableElements: DroppableElement[] = []

  /** --------------------------- */

  constructor(public dialogService: DialogService, private cinemaService: CinemaServiceService) {
    //this.generateSeats()
    this.generateData()
    this.generateAllElements()
    //this.setHeightCount()
    //this.setWidthCount()
    //console.log(this.adminHall)
    //console.log("consrtuctor")
  }

  ngOnInit(): void {
    this.setStyle()
    //console.log("init")
    //this.generateSelectRowButtons()

  }

  ngAfterViewInit() {
    const droppableElems = document.getElementsByClassName("droppable")
    for (let i = 0; i < this.droppableElements.length; i++) {
      this.droppableElements[i].element = droppableElems[i] as HTMLElement
    }
  }

  ngAfterViewChecked() {
    this.shiftContainerX = Math.floor(this.adminHall.nativeElement.offsetLeft)
    this.shiftContainerY = Math.floor(this.adminHall.nativeElement.offsetTop)

    const droppableElems = document.getElementsByClassName("droppable")
    if (this.droppableElements[0].element !== droppableElems[0] as HTMLDivElement) {
      for (let i = 0; i < this.droppableElements.length; i++) {
        this.droppableElements[i].element = droppableElems[i] as HTMLElement
      }
      //console.log("update")
    }
    //console.log(this.adminHall.nativeElement.offsetTop)
  }
  /* start generators */

  private generateAllElements() {
    this.styleDroppableElements = []
    this.droppableElements = []
    for (let i = 0; i < this.hallHeight; i++) {
      for (let j = 0; j < this.hallWidth; j++) {
        this.styleDroppableElements.push({
          width: `${this.hallScale * this.seatWidth}px`,
          height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`,
          left: `${j * this.scale}px`,
          top: `${i * (this.scale + Math.round(this.hallScale * 0.2))}px`
        })
        this.droppableElements.push({
          position: {
            x: j * this.scale,
            y: i * (this.scale + Math.round(this.hallScale * 0.2))
          },
          element: null
        })
      }
    }
  }

  private generateData() {
    const newData: Data[] = []

    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth

    let row = 1
    for (let i = 0; i < this.hallHeight - this.seatWidth; i += this.seatWidth) {
      newData.push(...this.generateDataRow(i, row++))
    }
    newData.push(...this.generateDataRow(this.hallHeight - 1, row++, this.sofaWidth))
    this.data = newData
  }

  // private generateSelectRowButtons() {
  //   let lastRowNumber = 0

  //   const selectedButtons: SelectedRowButton[] = []
  //   const sortedData = this.data.sort((data1, data2) => data1.seat.row - data2.seat.row)

  //   sortedData.forEach(elem => {
  //     if (lastRowNumber !== elem.seat.row) {
  //       selectedButtons.push({
  //         row: elem.seat.row,
  //         style: {
  //           //height: "50px",
  //           //width: "50px",
  //           top: `${elem.position.y}px`,
  //           left: `${-190}px`
  //         }
  //       })
  //       lastRowNumber = elem.seat.row
  //     }
  //   })

  //   this.selectRowButton = selectedButtons
  // }

  // private generateShowButtonInnerStyle(): Height[] {
  //   const style: Height[] = []

  //   for (let i = 0; i < this.hallHeight; i++) {
  //     style.push({ height: `${this.hallScale}px` })
  //   }

  //   return style
  // }

  generateDataRow(index: number, row: number, countSeat?: number): Data[] {
    const coordinateY = index + 1
    const dataRow: Data[] = []

    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth

    const del = countSeat ? this.seatWidth * countSeat : this.seatWidth

    const end = countSeat ? this.hallWidth - countSeat - this.seatWidth : this.hallWidth
    for (let i = 0, seatNumber = 1; i < end; i += del, seatNumber++) {
      dataRow.push({
        seat: {
          x: i + 1,
          y: coordinateY,
          row: row,
          number: seatNumber,
          type: countSeat ? new Sofa(countSeat) : new Single(),
          closet: false,
          price: 150,
          brone: false
        },
        position: {
          x: i * this.scale,
          y: index * (this.hallScale + Math.round(this.hallScale * 0.2))
        },
        size: {
          width: `${this.hallScale * this.seatWidth}px`,
          height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`
        },
        innerSize: {
          width: `${innerWidth}px`,
          height: `${innerWidth}px`
        },
        elem: null,
        isSelected: false
      })
    }

    // this.selectRowButton.push({
    //   row: row,
    //   style: {
    //     top: `${index * (this.hallScale + Math.round(this.hallScale * 0.2))}px`,
    //     left: `${-190}px`
    //   }
    // })
    return dataRow
  }

  private generateRowFromTo(xFrom: number, xTo: number, y: number, row: number, countSeat?: number) {
    console.log(xFrom + " " + xTo)
    //console.log("xTo", xTo)
    const del = countSeat ? this.seatWidth * countSeat : this.seatWidth
    if (xTo <= this.hallWidth) {
      //console.log("generate")
      for (let i = xFrom; i <= xTo; i += del) {
        this.data.push({
          seat: {
            x: i,
            y: y,
            row,
            number: 5,
            type: countSeat ? new Sofa(countSeat) : new Single(),
            closet: false,
            brone: false,
            price: 150
          },
          position: {
            x: (i - 1) * this.scale,
            y: (y - 1) * (this.hallScale + Math.round(this.hallScale * 0.2))
          },
          size: {
            width: `${this.hallScale * this.seatWidth}px`,
            height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`
          },
          innerSize: {
            width: `${innerWidth}px`,
            height: `${innerWidth}px`
          },
          elem: null,
          isSelected: false
        })
      }
    }
  }

  // private setHeightCount() {
  //   console.log("height")
  //   const hallHeightCount: number[] = []
  //   for (let i = 0; i < this.hallHeight; i++) {
  //     hallHeightCount.push(i)
  //   }
  //   this.hallHeightCount = hallHeightCount
  // }

  // private setWidthCount() {
  //   console.log("width")
  //   const hallWidthCount: number[] = []
  //   for (let i = 0; i < this.hallWidth; i++) {
  //     hallWidthCount.push(i)
  //   }
  //   this.hallWidthCount = hallWidthCount
  // }

  /* end generators */

  mouseDown(event: MouseEvent, index: number): void {
    //выделяем ряд при нажатой левой кнопке мыши и зажатым шифтом
    if (event.buttons === 1 && event.shiftKey)
      this.selectRow(this.data[index].seat.row)

    this.startDragAndDrop(event, index)
  }

  mouseMove(event: MouseEvent): void {
    this.selectingArea(event)
    this.processDragAndDrop(event)
  }

  mouseUp(event: MouseEvent, index: number): void {
    //console.log("end drag and drop")
    if (this.isMovable)
      this.endDragAndDrop(event, index)
  }

  /* start drag and drop */

  private startDragAndDrop(event: MouseEvent, index: number): void {
    const leftButton = 1

    if (event.buttons === leftButton) {
      // this.selectedSeats.forEach(selected => {
      //   console.log(selected.position)
      // })
      //если не нажата клавиша ctrl или shift, то можем перемещать выбранные элементы
      if (!event.ctrlKey && !event.shiftKey) {
        this.isMovable = true
      }

      const seat = this.data[index].elem!
      this.data[index].isSelected = true
      //seat.style.visibility = 'hidden'

      seat.style.zIndex = "15"

      const init: Position = {
        x: this.data[index].position.x,
        y: this.data[index].position.y
      }

      const findSomeElem = this.selectedSeats.find(elem => elem.index === index)

      if (!findSomeElem) {
        //console.log("here")
        //console.log(this.getDroppable(this.data[index].elem!))
        if (this.data[index].seat.type.type === SeatType.SINGLE) {
          this.selectedSeats.push({
            element: seat,
            droppable: [null],//[this.getDroppable(this.data[index].elem!)], 
            //lastDroppable: [null],//[this.getDroppable(this.data[index].elem!)],
            index,
            position: init
          })
        } else {
          const droppable: any[] = []
          const seatCount = (this.data[index].seat.type.countSeat * 2) - 1
          for (let i = 0; i < seatCount; i++) {
            droppable.push(null)
          }
          this.selectedSeats.push({
            element: seat,
            droppable,
            //lastDroppable: droppable, 
            index,
            position: init
          })
        }
      }
      //console.log(this.selectedSeats)
      this.movableSeat = seat
      //мещение курсора внутри сиденья
      this.shiftCursorX = Math.floor(event.clientX) - Math.floor(seat.getBoundingClientRect().left)
      this.shiftCursorY = Math.floor(event.clientY) - Math.floor(seat.getBoundingClientRect().top)
    }
  }

  private processDragAndDrop(event: MouseEvent): void {
    if (this.isMovable) {
      //перемещаем выбранный элемент
      const innerX = Math.floor(event.pageX - this.shiftContainerX - this.shiftCursorX)
      const innerY = Math.floor(event.pageY - this.shiftContainerY - this.shiftCursorY)

      //console.log(innerX + " " + innerY)
      const beforeX = parseInt(this.movableSeat!.style.left)
      const beforeY = parseInt(this.movableSeat!.style.top)
      //console.log(innerX + " " + innerY)
      this.moveElemTo(this.movableSeat!, innerX, innerY)
      const afterX = parseInt(this.movableSeat!.style.left)
      const afterY = parseInt(this.movableSeat!.style.top)

      const delX = beforeX - afterX
      const delY = beforeY - afterY


      let localError = false

      for (let i = 0; i < this.selectedSeats.length; i++) {
        let {
          element: selected,
          droppable: droppableArray,
          //lastDroppable,
          index,
          position
        } = this.selectedSeats[i]
        //let droppable = droppableArray[0]

        //fint
        let targetX = this.shiftCursorX
        let targetY = this.shiftCursorY

        if (selected !== this.movableSeat) {
          //console.log(`delX: ${delX} delY: ${delY}`)
          const moveToX = this.data[index].position.x - delX
          const moveToY = this.data[index].position.y - delY

          this.moveElemTo(selected, moveToX, moveToY)

          this.data[index].position.x = moveToX
          this.data[index].position.y = moveToY

          targetX += moveToX
          targetY += moveToY
        } else {
          this.data[index].position.x = afterX
          this.data[index].position.y = afterY
          targetX += afterX
          targetY += afterY
        }


        //if (this.checkSeatAround(index)) return 
        //selected.hidden = true

        //console.log(droppableArray)
        if (droppableArray.length === 1) {
          //console.log("lenght 1")
          //selected.style.visibility = "hidden"
          //смотрим элемент под сиденем (перетаскиваемый объект)
          //console.log(targetX)
          //const elementFromX = targetX + this.shiftContainerX - Math.floor(window.scrollX)
          //const elementFromY = targetY + this.shiftContainerY - Math.floor(window.scrollY)
          //let elemBelow = document.elementFromPoint(elementFromX, elementFromY)
          //selected.hidden = false
          //console.log(`${targetX + this.shiftContainerX} ${targetY + this.shiftContainerY}`)
          //selected.style.visibility = ""
          //console.log("here")
          //console.log(`targetX: ${targetX} targetY: ${targetY}`)

          //console.log("target: " + targetX)
          //находим элемент на который будет перемещено выбранное место
          const findDropppable = this.droppableElements.find(({ position }) => {
            if (position.x < targetX && position.x + this.scale > targetX)
              if (position.y < targetY && position.y + (this.scale + Math.round(this.scale * 0.2)) > targetY) {
                return true
              }
            return false
          })

          let droppable = droppableArray[0]
          //let last = lastDroppable[0]
          //console.log(droppable)
          if (!findDropppable) {
            localError = true
            if (droppable) {
              droppable.firstChild.style.backgroundColor = ''
              droppable.style.zIndex = ''
            }
            continue
          }
          //console.log(selected)
          const isDropperCorrect = this.droppedCorrect(findDropppable!.element as HTMLElement)
          //console.log(isDropperCorrect)

          /**if (droppableArray)
           droppable.style.zIndex = ""*/
          //if (!elemBelow) return

          if (isDropperCorrect) {
            if (findDropppable.element == droppable) continue
            else {
              const currDropplable = findDropppable.element as any

              //last = droppable
              //droppable = currDropplable
              //console.log("here")
              currDropplable.firstChild.style.backgroundColor = 'red'
              currDropplable.style.zIndex = '5'

              if (droppable) {
                droppable.firstChild.style.backgroundColor = ''
                droppable.style.zIndex = ''
              }
              droppable = currDropplable
            }
          } else {
            localError = true
            if (droppable) {
              droppable.firstChild.style.backgroundColor = ''
              droppable.style.zIndex = ''
              droppable = null
            }
          }


          //console.log(elemBelow)
          //let droppableBelow = elemBelow.closest('.droppable')

          // let droppableBelow = findDropppable.element

          // if (droppableBelow === null) {
          //   //console.log("null")
          //   localError = true
          // } else {
          //   if (!this.dropedCorrect(index, droppableBelow as HTMLElement)) {
          //     droppableBelow = null
          //     localError = true
          //   }
          // }
          // if (droppable != droppableBelow) {
          //   if (droppable) {
          //     // логика обработки процесса "вылета" из droppable (удаляем подсветку)
          //     droppable!.firstChild.style.backgroundColor = ''
          //     droppable.style.zIndex = ''
          //   }
          //   droppable = droppableBelow;
          //   if (droppable) {
          //     // логика обработки процесса, когда мы "влетаем" в элемент droppable
          //     droppable.firstChild.style.backgroundColor = 'red'
          //     droppable.style.zIndex = '5'
          //   }
          //}

          this.selectedSeats[i] = {
            element: selected,
            droppable: [droppable],
            //lastDroppable: [last],
            index,
            position
          }

          // this.selectedSeats.forEach(selected => {
          //   console.log(selected.position)
          // })
          // } else {
          //   const newDroppable: any[] = []
          //   /* selected.style.visibility = "hidden"
          //    //смотрим элемент под сиденем (перетаскиваемый объект)
          //    let elemBelow = document.elementFromPoint(targetX + this.shiftContainerX, targetY + this.shiftContainerY)
          //    selected.style.visibility = ""*/
          //   const shiftN = Math.floor(this.shiftCursorX / (this.scale * this.seatWidth))
          //   const delShiftX = this.shiftCursorX - (shiftN * this.scale * this.seatWidth)
          //   //console.log(delShiftX)
          //   const leftCoordinate = selected.offsetLeft
          //   //console.log(leftCoordinate)

          //   /*const innerSize = Math.round(this.scale * 0.8)
          //   const innerWidth = innerSize * this.seatWidth*/
          //   droppableArray.forEach((droppable, index) => {

          //     const currShiftX = leftCoordinate + (delShiftX + (this.scale * 2 * index))

          //     //console.log(currShiftX + " " + index)
          //     const elementFromX = currShiftX + this.shiftContainerX - Math.floor(window.scrollX)
          //     const elementFromY = targetY + this.shiftContainerY - Math.floor(window.scrollY)

          //     selected.style.visibility = "hidden"
          //     /*this.selectedSeats.forEach(selected => {
          //       const [htmlElem] =  selected
          //       htmlElem.style.visibility = "hidden"
          //     })*/
          //     //смотрим элемент под сиденем (перетаскиваемый объект)
          //     let elemBelow = document.elementFromPoint(elementFromX, elementFromY)
          //     //console.log(`${currShiftX + this.shiftContainerX} ${targetY + this.shiftContainerY}`)
          //     selected.style.visibility = ""

          //     /*this.selectedSeats.forEach(selected => {
          //       const [htmlElem] =  selected
          //       htmlElem.style.visibility = ""
          //     })*/
          //     if (!elemBelow) return

          //     let droppableBelow = elemBelow.closest('.dropable')

          //     if (droppableBelow === null) {
          //       localError = true
          //     } else {
          //       if (!this.dropedCorrect(index, droppableBelow as HTMLElement)) {
          //         droppableBelow = null
          //         localError = true
          //       }
          //     }
          //     if (droppable != droppableBelow) {
          //       if (droppable) {
          //         // логика обработки процесса "вылета" из droppable (удаляем подсветку)
          //         droppable!.firstChild.style.backgroundColor = ''
          //         droppable.style.zIndex = ''
          //       }
          //       droppable = droppableBelow;
          //       if (droppable) {
          //         // логика обработки процесса, когда мы "влетаем" в элемент droppable
          //         droppable.firstChild.style.backgroundColor = 'red'
          //         droppable.style.zIndex = '5'
          //       }
          //     }

          //     newDroppable.push(droppable)
          //   })
          //   this.selectedSeats[i] = {
          //     element: selected, 
          //     droppable: newDroppable, 
          //     lastDroppable: droppableArray,
          //     index, 
          //     position: initPoint
          //   }
          // this.selectedSeats[i] = [selected, newDroppable, index, initPoint]
        } else {
          //console.log("length more 1")
          const shiftN = Math.floor(this.shiftCursorX / (this.scale * this.seatWidth))
          //const delShiftX = this.shiftCursorX - (shiftN * this.scale * this.seatWidth)
          //console.log(`shiftN: ${shiftN} del: ${delShiftX}`)
          //console.log(`targetXBefore: ${targetX}`)
          targetX -= (shiftN * this.scale * this.seatWidth)
          //console.log(`targetXAfter: ${targetX}`)

          //console.log(`minus target: ${shiftN * this.scale * this.seatWidth} shiftCursor: ${this.shiftCursorX}`)
          //console.log(targetX)

          /*let findDropppableIndex: number = this.droppableElements.findIndex(({ position }) => {
            if (position.x < targetX && position.x + this.scale > targetX)
              if (position.y < targetY && position.y + (this.scale + Math.round(this.scale * 0.2)) > targetY) {
                return true
              }
            return false
          })*/

          const countDroppable = (this.data[index].seat.type.countSeat * 2) - 1
          const findDroppable: any[] = []

          /*for (let i = 0; i < countDroppable; i++) {
            findDroppable.push(null)
          }*/


          let countFindDroppabel = 0

          for (let i = 0; i < this.droppableElements.length; i++) {

            const positionDroppable = this.droppableElements[i].position
            const rightBorder = positionDroppable.x + this.scale
            const bottomBorder = positionDroppable.y + (this.scale + Math.round(this.scale * 0.2))


            if (positionDroppable.x < targetX && rightBorder > targetX) {
              if (positionDroppable.y < targetY && bottomBorder > targetY) {
                //findDroppable[countFindDroppabel] = this.droppableElements[i]
                findDroppable.push(this.droppableElements[i])

                countFindDroppabel++
                targetX += this.scale

                if (countFindDroppabel === countDroppable)
                  break

              }
            }
          }
          /*if (findDropppableIndex){
            for (let i = 0; i < this.data[index].seat.type.countSeat; i++) {
              findDroppable.push(this.droppableElements[findDropppableIndex++])
            }
          }*/
          let droppable = droppableArray

          if (findDroppable.length !== countDroppable) {
            localError = true

            //console.log("error")

            droppable.forEach(drop => {
              drop.firstChild.style.backgroundColor = ''
              drop.style.zIndex = ''
            })

            continue
          }


          //let last = lastDroppable[0]


          const isDropperCorrect = this.droppedCorrect(findDroppable[0].element as HTMLElement)
          //console.log(isDropperCorrect)
          const newDroppable: any[] = []
          if (isDropperCorrect) {
            for (let i = 0; i < droppable.length; i++) {
              const currDropplable = findDroppable[i].element
              if (currDropplable == droppable[i]) {
                currDropplable.firstChild.style.backgroundColor = 'red'
                currDropplable.style.zIndex = '5'
                newDroppable.push(currDropplable)
              }
              else {
                if (droppable[i]) {
                  droppable[i].firstChild.style.backgroundColor = ''
                  droppable[i].style.zIndex = ''
                }
                newDroppable.push(currDropplable)
              }
            }
          } else {
            for (let i = 0; i < droppable.length; i++) {
              localError = true
              if (droppable[i]) {
                droppable[i].firstChild.style.backgroundColor = ''
                droppable[i].style.zIndex = ''
              }
              newDroppable.push(null)
            }
          }
          //console.log(newDroppable)
          
          // const newDroppable: any[] = []

          // //console.log("currentDroppable")
          // //console.log(findDroppable)
          // //console.log("lastDroppable")
          // //console.log(droppable)
          // for (let i = 0; i < droppable.length; i++) {
          //   const currDropplable = findDroppable[i].element

          //   // console.log("find")
          //   // console.log(currDropplable)
          //   // console.log("drop")
          //   // console.log(droppable[i])
          //   if (currDropplable == droppable[i]) {
          //     newDroppable.push(currDropplable)
          //     //console.log("true")
          //     continue
          //   }
          //   else {
          //     currDropplable.firstChild.style.backgroundColor = 'red'
          //     currDropplable.style.zIndex = '5'

          //     if (droppable[i]) {
          //       droppable[i].firstChild.style.backgroundColor = ''
          //       droppable[i].style.zIndex = ''
          //     }
          //     newDroppable.push(currDropplable)
          //   } /*else {
          //     if (droppable[i]) {
          //       droppable[i].firstChild.style.backgroundColor = ''
          //       droppable[i].style.zIndex = ''
          //     }
          //     newDroppable.push(null)
          //   }*/
          // }
          //console.log("----------")
          // droppable.forEach((droppable, index) => {
          //   const currDropplable = findDroppable[index].element
          //   if (currDropplable && findDroppable !== droppable) {


          //     currDropplable.firstChild.style.backgroundColor = 'red'
          //     currDropplable.style.zIndex = '5'

          //     if (droppable) {
          //       droppable.firstChild.style.backgroundColor = ''
          //       droppable.style.zIndex = ''
          //     }
          //     newDroppable.push(currDropplable)
          //   } else {
          //     if (droppable) {
          //       droppable.firstChild.style.backgroundColor = ''
          //       droppable.style.zIndex = ''
          //     }
          //     newDroppable.push(null)
          //   }


          //   /*if (droppable && droppable !== findDroppable[index].element) {
          //     const currDropplable = findDroppable[index].element

          //     currDropplable.firstChild.style.backgroundColor = 'red'
          //     currDropplable.style.zIndex = '5'

          //     if (droppable) {
          //       droppable.firstChild.style.backgroundColor = ''
          //       droppable.style.zIndex = ''
          //     }
          //     newDroppable.push(currDropplable)
          //   } else {
          //     newDroppable.push(null)
          //   }  */
          // })
          //console.log(selected)
          //const isDropperCorrect = this.dropedCorrect(findDropppable!.element as HTMLElement)
          //console.log(isDropperCorrect)


          // if (isDropperCorrect) {
          //   if (findDropppable.element == droppable) continue 
          //   else { 
          //     const currDropplable = findDropppable.element as any

          //     currDropplable.firstChild.style.backgroundColor = 'red'
          //     currDropplable.style.zIndex = '5'

          //     if (droppable) {
          //       droppable.firstChild.style.backgroundColor = ''
          //       droppable.style.zIndex = ''
          //     }
          //     droppable = currDropplable
          //   }
          // } else {
          //   localError = true
          //   if (droppable) {
          //     droppable.firstChild.style.backgroundColor = ''
          //     droppable.style.zIndex = ''
          //     droppable = null
          //   }
          // }
          this.selectedSeats[i] = {
            element: selected,
            droppable: newDroppable,
            index,
            position
          }
        }
      }

      this.movableError = localError

    }
  }

  private endDragAndDrop(event: MouseEvent, index: number): void {
    this.isMovable = false

    if (!event.ctrlKey) {
      //console.log("end")
      //this.data[index].isSelected = false
      //console.log(this.movableError)
      //console.log(this.selectedSeats)
      this.selectedSeats.forEach(
        ({
          element: selected,
          droppable: target,
          index: i,
          position: initPoint
        }) => {

          selected.style.zIndex = ""

          this.data[i].isSelected = false
          /*if (target){
            target.firstChild.style.backgroundColor = ''
            target.style.zIndex = ""
          }*/
          target.forEach(elem => {
            if (elem !== null) {
              elem.firstChild.style.backgroundColor = ''
              elem.style.zIndex = ""
            }
          })

          if (this.movableError) {
            //console.log("here")
            selected.style.left = `${initPoint.x}px`,
              selected.style.top = `${initPoint.y}px`

            this.data[i].position = initPoint

          } else {
            if (target[0]) {
              const left = target[0].style.left
              const top = target[0].style.top
              selected.style.left = left
              selected.style.top = top

              const currPosition = {
                x: parseInt(left),
                y: parseInt(top)
              }

              this.data[i].position = currPosition

              const coordinate = this.convertToCoordinate(left, top)
              this.data[i].seat.x = coordinate.x
              this.data[i].seat.y = coordinate.y
            }

            // if (this.isSelectedRow) {
            //   const [selected, target, i, initPoint] = this.selectedSeats[0]
            //   //перемещаем кнопку выбора ряда
            //   const selectedRowIndex = this.selectRowButton
            //     .findIndex(elem => elem.row === this.data[i].seat.row)
            //   this.selectRowButton[selectedRowIndex] = {
            //     ...this.selectRowButton[selectedRowIndex],
            //     style: {
            //       top: `${this.data[i].position.y}px`,
            //       left: `${-190}px`
            //     }
            //   }

            //   this.isSelectedRow = false
            // }
          }
        })
      this.checkSeatAfterMove()
      /*if (!this.movableError && this.isSelectedRow) {
        const [selected, target, i, initPoint] = this.selectedSeats[0]
        //перемещаем кнопку выбора ряда
        const selectedRowIndex = this.selectRowButton
          .findIndex(elem => elem.row === this.data[i].seat.row)
        this.selectRowButton[selectedRowIndex] = {
          ...this.selectRowButton[selectedRowIndex],
          style: {
            top: `${this.data[i].position.y}px`,
            left: `${-190}px`
          }
        }
      }*/
      this.selectedSeats = []
    }
    this.movableSeat = null
    //this.isSelectedRow = false

  }

  private moveElemTo(elem: HTMLElement, x: number, y: number): void {
    elem.style.left = `${x}px`
    elem.style.top = `${y}px`
  }

  private droppedCorrect(droppableElement: HTMLElement): boolean {
    const droppablePosition: Position = {
      x: parseInt(droppableElement.style.left),
      y: parseInt(droppableElement.style.top)
    }
    const find = this.data.find(dataElem => {
      const oneOfSelectedElem = this.selectedSeats.find(
        selectedElem => selectedElem.element == dataElem.elem
      )
      if (!oneOfSelectedElem) {

        const leftBorder = dataElem.position.x - (dataElem.seat.type.countSeat * this.scale * this.seatWidth)
        const rightBorder = dataElem.position.x + (dataElem.seat.type.countSeat * this.scale * this.seatWidth)
        const topBorder = dataElem.position.y - (this.scale * this.seatWidth + Math.floor(this.scale * this.seatWidth * 0.2))
        const bottomBorder = dataElem.position.y + (this.scale * this.seatWidth + Math.floor(this.scale * this.seatWidth * 0.2))

        //console.log(`left: ${leftBorder} right: ${rightBorder} top: ${topBorder} bottom: ${bottomBorder}`)
        //console.log(`left: ${leftBorder} right: ${rightBorder}`)
        //console.log(`x: ${droppablePosition.x} y: ${droppablePosition.y}`)

        if (droppablePosition.x > leftBorder && droppablePosition.x < rightBorder)
          if (droppablePosition.y > topBorder && droppablePosition.y < bottomBorder)
            return true
        //console.log("no ravno")
      } else {
        //console.log("ravno")
      }
      return false
    })
    //console.log(find ? false : true)
    return find ? false : true
    // const x = parseInt(droppable.style.left)
    // const y = parseInt(droppable.style.top)

    // const find = this.data.find(elem => {
    //   const seat = elem.elem
    //   const position = elem.position

    //   const oneOfTheSelected = this.selectedSeats.find(
    //     ({element}) => element === seat
    //   )
    //   if (oneOfTheSelected) return
    //   //if (seat === this.data[dragableIndex].elem) return

    //   //console.log(`${position.x + (this.hallScale * this.seatWidth)} ${x}`)

    //   const leftBorder = position.x - (this.hallScale * this.seatWidth)
    //   let rightBorder
    //   //const rightBorder = position.x + (this.hallScale * this.seatWidth)
    //   if (elem.seat.type.type === SeatType.SINGLE) {
    //     rightBorder = position.x + (this.hallScale * this.seatWidth)
    //   } else {
    //     rightBorder = position.x + (this.hallScale * this.seatWidth * elem.seat.type.countSeat)
    //   }

    //   const bottomBorder = position.y + ((this.hallScale) * this.seatWidth)
    //   const topBorder = position.y - (this.hallScale * this.seatWidth)

    //   //console.log(`left: ${leftBorder} right: ${rightBorder} top: ${topBorder} bottom: ${bottomBorder}`)
    //   //console.log(`x: ${x} y: ${y}`)
    //   //console.log(`px: ${position.x} py: ${position.y}`)
    //   //console.log(`x: ${leftBorder < x && rightBorder > x} y: ${topBorder < y && bottomBorder > y}`)
    //   if (leftBorder < x && rightBorder > x)
    //     if (topBorder < y && bottomBorder > y) {
    //       //console.log(seat)
    //       //console.log(elem)
    //       //console.log(`left: ${leftBorder} right: ${rightBorder} top: ${topBorder} bottom: ${bottomBorder}`)
    //       return seat
    //     }

    //   return
    // })
    // //console.log(find ? true: false)
    // return find ? false : true
  }

  private checkSeatAfterMove() {
    if (this.selectedSeats.length === 1) {
      const index = this.selectedSeats[0].index
      const row = this.data[index].seat.row
      this.adjustmentSeatNumber(row)
      // const [elem, droppable, index, position] = this.selectedSeats[0]
      // const currSeat = this.data[index].seat

      // const leftSeats: Data[] = []
      // const rightSeats: Data[] = []

      // this.data.forEach(elem => {
      //   if (elem.seat.row === currSeat.row) {
      //     if (elem.seat.x < currSeat.x) {
      //       leftSeats.push(elem)
      //     }
      //     if (elem.seat.x > currSeat.x) {
      //       rightSeats.push(elem)
      //     }
      //   }
      // });

      // if (leftSeats.length > 0) {
      //   let maxX = leftSeats[0].seat.x
      //   let numberForMaxX = leftSeats[0].seat.number
      //   for (let i = 1; i < leftSeats.length; i++) {
      //     if (leftSeats[i].seat.x > maxX) {
      //       maxX = leftSeats[i].seat.x
      //       numberForMaxX = leftSeats[i].seat.number
      //     }
      //   }

      //   if (numberForMaxX > currSeat.number) {
      //     let newNumber = 1
      //     leftSeats
      //       .sort((a, b) => a.seat.x - b.seat.x)
      //       .forEach(({ seat }) => {
      //         seat.number = newNumber++
      //       })
      //     currSeat.number = newNumber
      //   } else {
      //     currSeat.number = numberForMaxX + 1
      //   }
      //   //currSeat.number = numberForMaxX
      // } else {
      //   currSeat.number = 1
      // }

      // //currSeat.number++

      // let numberForRightSeats = currSeat.number + 1
      // rightSeats
      //   .sort((a, b) => a.seat.x - b.seat.x)
      //   .forEach(({ seat }) => {
      //     seat.number = numberForRightSeats++
      //   })
    }

    if (this.isSelectedRow) {
      this.adjustmentSeatRow()
      // const rows = new Map<number, Seat[]>()

      // this.data.forEach(({ seat }) => {
      //   const seatsGroup = rows.get(seat.row)
      //   if (seatsGroup) {
      //     seatsGroup.push(seat)
      //     rows.set(seat.row, seatsGroup)
      //   } else {
      //     rows.set(seat.row, [seat])
      //   }
      // })

      // const sortedRows = new Map<number, Seat[]>(
      //   [...rows.entries()].sort((a, b) => {
      //     const [rowA, seatsA] = a
      //     const [rowB, seatsB] = b
      //     return seatsA[0].y - seatsB[0].y
      //   })
      // )

      // let newRow = 1
      // //let index = 0
      // sortedRows.forEach((value) => {
      //   //this.selectRowButton[index++].row = newRow
      //   value.forEach(seat => {
      //     seat.row = newRow
      //   })
      //   newRow++
      // })
      /*const [selected, target, i, initPoint] = this.selectedSeats[0]
      //перемещаем кнопку выбора ряда
      const selectedRowIndex = this.selectRowButton
        .findIndex(elem => elem.row === this.data[i].seat.row)
      this.selectRowButton[selectedRowIndex] = {
        ...this.selectRowButton[selectedRowIndex],
        style: {
          top: `${this.data[i].position.y}px`,
          left: `${-190}px`
        }
      }*/
    }
  }

  //прерываем нативный drag and drop
  dragStart() {
    return false
  }

  setElem(elem: HTMLElement | null, index: number) {
    this.data[index].elem = elem
  }

  /* end drag and drop*/

  private convertToCoordinate(left: string, top: string): Position {
    const position: Position = {
      x: parseInt(left) / (this.hallScale) + 1,
      y: parseInt(top) / (this.hallScale + Math.round(this.hallScale * 0.2)) + 1
    }

    return position
  }

  /*getDroppable(selectedElem: HTMLElement): HTMLElement | null {
    const findDroppable = this.droppableElements.find(elem => 
      elem.element?.style.left === selectedElem.style.left &&
      elem.element.style.top === selectedElem.style.top
    )
    return findDroppable ? findDroppable.element : null
  }*/

  selectRow(row: number) {

    this.isSelectedRow = true
    const findElem = this.data.find(({ seat }) => seat.row === row)

    const droppable: any[] = []
    const count = (findElem!.seat.type.countSeat * 2) - 1
    for (let i = 0; i < count; i++) {
      droppable.push(null)
    }

    this.data.forEach((elem, index) => {
      if (elem.seat.row === row) {
        this.data[index].isSelected = true
        elem.elem!.style.zIndex = "15"
        this.selectedSeats.push({
          element: elem.elem!,
          droppable,
          //lastDroppable: droppable,
          index,
          position: {
            x: elem.position.x,
            y: elem.position.y,
          }
        })
      }
    })
  }

  /*correctRow() {
    if (this.isSelectedRow) {
      const [selected, target, i, initPoint] = this.selectedSeats[0]
      //перемещаем кнопку выбора ряда
      const selectedRowIndex = this.selectRowButton
        .findIndex(elem => elem.row === this.data[i].seat.row)
      this.selectRowButton[selectedRowIndex] = {
        ...this.selectRowButton[selectedRowIndex],
        style: {
          top: `${this.data[i].position.y}px`,
          left: `${-190}px`
        }
      }

      this.isSelectedRow = false
    }
  }*/

  private setStyle() {
    //высота на 20% больше ширины
    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth
    this.style = {
      hall: {
        width: `${(this.hallWidth + this.seatWidth) * this.hallScale}px`,
        height: `${(this.hallHeight + this.seatWidth) * (this.hallScale + Math.round(this.hallScale * 0.2))}px`
      },
      innerElem: {
        width: `${innerWidth}px`,
        height: `${innerWidth}px`
      },
      // showButton: {
      //   height: `${this.hallScale + Math.round(this.hallScale * 0.2)}px`
      // },
      // showButtonInner: this.generateShowButtonInnerStyle()

    }
    // this.buttonVerticalHeight = {
    //   height: `${(this.hallScale + Math.round(this.hallScale * 0.2))}px`
    // }
  }



  updateState() {
    this.scale = this.hallScale
    this.seatWidth = this.formSeatWidth
    //this.setWidthCount()
    //this.setHeightCount()
    this.generateData()
    //this.generateSelectRowButtons()
    this.generateAllElements()
    this.setStyle()
  }


  // deleteRow(index: number): void {
  //   const coordinate = index + 1

  //   const currentRow = this.data.find(({ seat }) => seat.y === coordinate)
  //   if (currentRow) {
  //     // this.selectRowButton = this.selectRowButton
  //     //   .filter(({ row }) => row !== currentRow!.seat.row)
  //     //   .map(elem => {
  //     //     if (elem.row > currentRow!.seat.row) {
  //     //       elem.row--
  //     //       return elem
  //     //     }
  //     //     return elem
  //     //   })

  //     this.data = this.data
  //       .filter(({ seat }) => seat.y !== coordinate)
  //       .map(elem => {
  //         if (elem.seat.row > currentRow!.seat.row) {
  //           elem.seat.row--
  //           return elem
  //         }
  //         return elem
  //       })
  //   }


  //   //this.generateSelectRowButtons()
  // }

  // addRow(index: number, countSeat?: number): void {
  //   const coordinate = index + 1

  //   if (index <= this.hallHeight) {
  //     const haveRow = this.data.find(
  //       ({ seat }) => seat.y < coordinate + this.seatWidth && seat.y > coordinate - this.seatWidth
  //     )
  //     if (!haveRow) {
  //       const rowUnderGeterated = this.data.filter(({ seat }) => seat.y > coordinate)
  //       //console.log(rowUnderGeterated)
  //       let newRow = 0
  //       if (rowUnderGeterated.length > 0) {
  //         let minRow = rowUnderGeterated[0].seat.row
  //         rowUnderGeterated.forEach(({ seat }) => {
  //           if (seat.row < minRow) {
  //             minRow = seat.row
  //           }
  //           seat.row = seat.row + 1
  //         })
  //         newRow = minRow
  //       } else {
  //         if (this.selectRowButton.length === 0) {
  //           newRow = 1
  //         } else {
  //           const sorted = this.selectRowButton.sort((a, b) => b.row - a.row)
  //           //console.log(sorted)
  //           newRow = sorted[0].row + 1
  //         }
  //       }

  //       //проверить эффективность
  //       this.generateSelectRowButtons()
  //       this.data.push(...this.generateDataRow(index, newRow, countSeat))

  //       //this.seats = this.seats.concat(this.generateRowSeats(1, this.hallWidth, coordinate))
  //     }
  //   }
  // }

  showButtons(ref: HTMLDivElement) {
    ref.classList.toggle("admin-hall-buttons-show-show")
  }

  contextMenuForSeat(event: MouseEvent, contextMenu: HTMLElement) {
    event.preventDefault()

    const rightButton = 2

    const shiftCursorX = Math.floor(event.clientX + window.scrollX) - this.shiftContainerX
    const shiftCursorY = Math.floor(event.clientY + window.scrollY) - this.shiftContainerY
   
    if (event.button === rightButton) {
      this.closeContextMenu()
      contextMenu.classList.add("admin-hall-context-menu-show")
      contextMenu.style.left = `${shiftCursorX}px`
      contextMenu.style.top = `${shiftCursorY}px`

      this.contextMenuForSeatRef = contextMenu
    }
  }

  contextMenuForHall(event: MouseEvent, contextMenu: HTMLElement) {
    event.preventDefault()

    const rightButton = 2

    const shiftCursorX = Math.floor(event.offsetX) //- this.shiftContainerX
    const shiftCursorY = Math.floor(event.offsetY) //- this.shiftContainerY

    if (event.button === rightButton) {
      this.closeContextMenu()
      contextMenu.classList.add("admin-hall-context-menu-show")
      contextMenu.style.left = `${shiftCursorX}px`
      contextMenu.style.top = `${shiftCursorY}px`
      this.contextMenuForHallRef = contextMenu
    }
  }

  deleteSeat(index: number) {
    this.closeContextMenu()

    if (this.selectedSeats.length === 0) {
      const removeSeat = this.data[index].seat
      this.data.splice(index, 1)
      this.adjustmentSeatNumber(removeSeat.row)
      // this.data.forEach(({ seat }) => {
      //   if (seat.row === removeSeat.row) {
      //     if (seat.number > removeSeat.number) {
      //       seat.number--
      //     }
      //   }
      // })
    } else {
      const rows = new Set<number>()

      const storeRemoveElements: Data[] = []
      //удаляем все выбранные элементы
      this.selectedSeats.forEach(elem => {
        const i: number = elem.index
        storeRemoveElements.push(this.data[i])
        /*rows.add(this.data[i].seat.row)
        const index = this.data.findIndex(find => find.elem == elem[0])
        this.data.splice(index, 1)*/
      })

      storeRemoveElements.forEach(({ seat }) => {
        const i = this.data.findIndex((find) => seat.x === find.seat.x && seat.y === find.seat.y)
        this.data.splice(i, 1)
      })

      //нормализуем номера сидений для рядов  в которых произошли удаления
      for (let row of rows) {
        this.adjustmentSeatNumber(row)
      }
      this.selectedSeats = []

      this.adjustmentSeatRow()

    }

  }

  private adjustmentSeatNumber(row: number) {
    let newNumber: number = 1
    this.data
      .filter(({ seat }) => seat.row === row)
      .sort((a, b) => a.seat.x - b.seat.x)
      .forEach(({ seat }) => seat.number = newNumber++)
  }

  private adjustmentSeatRow() {
    const oneRowElements = new Map<number, Seat[]>()
      this.data.forEach(value => {
        const seats = oneRowElements.get(value.seat.row)
        if (seats) {
          seats.push(value.seat)
        } else {
          oneRowElements.set(value.seat.row, [value.seat])
        }
      })

      const sortedOneRowElements = new Map<number, Seat[]>(
        [...oneRowElements.entries()].sort((a, b) => {
          const [rowA, seatsA] = a
          const [rowB, seatsB] = b
          return seatsA[0].y - seatsB[0].y
        })
      )

      let newRow = 1
      sortedOneRowElements.forEach(value => {
        value.forEach(seat => seat.row = newRow)
        newRow++
      })
  }

  private canAdd(x: number, y: number) {
    //countSeat - ширина дивана
    return (row: number, count: number, side: Side, countSeat?: number): AddSeatError => {
      //console.log(side)
      if (side === Side.RIGHT) {
        const rightBorder = countSeat ?
          x + (count * this.seatWidth * countSeat) - this.seatWidth :
          x + ((count - 1) * this.seatWidth)
        //console.log("rightBorder", rightBorder)

        /*const actualRightBorder = countSeat ? 
          this.hallWidth + (countSeat * this.seatWidth): 
          this.hallWidth + this.seatWidth
        */
        //console.log("rightBorder", rightBorder, "actualBorder", this.hallWidth/*actualRightBorder*/)
        if (rightBorder > this.hallWidth) return new AddSeatError("Выход за правую границу")

        const borderTop = y - this.seatWidth
        const borderBottom = y + this.seatWidth

        //console.log(`borderTop: ${borderTop} borderBottom: ${borderBottom}`)

        const rangeFromX = x - this.seatWidth
        const rangeToX = countSeat ?
          x + (count * this.seatWidth * countSeat) :
          x + (count * this.seatWidth)

        const findX = this.data.find(
          ({ seat }) =>
            (seat.y > borderTop && seat.y < borderBottom) &&
            (seat.x > rangeFromX && seat.x < rangeToX)
        )
        if (findX) return new AddSeatError("Невозможно добавить по данным координатам")
      }

      if (side === Side.LEFT) {
        let leftBorder = countSeat ?
          x - (count * this.seatWidth * countSeat) + 1 :
          x - (count * this.seatWidth) + 1
        //console.log("leftBorder", leftBorder, "x", x)
        if (leftBorder < 1) return new AddSeatError("Выход за левую границу")

        const borderTop = y - this.seatWidth
        const borderBottom = y + this.seatWidth

        //надо
        leftBorder--

        const findX = this.data.find(
          ({ seat }) =>
            (seat.y > borderTop && seat.y < borderBottom) &&
            (seat.x >= leftBorder && seat.x <= x)
        )

        if (findX) new AddSeatError("Невозможно добавить по данным координатам")
      }
      return new AddSeatError()
    }
  }

  addRows(currElem: HTMLElement) {
    const maxCount = Math.floor(this.hallWidth / this.seatWidth)
    const maxRow = this.hallHeight

    const coordinate: Position = this.convertToCoordinate(currElem.style.left, currElem.style.top)
    //console.log(elem)
    const x = coordinate.x /// this.scale
    const y = coordinate.y /// this.scale
    //console.log(`x: ${x}, y: ${y}`)
    const ref = this.dialogService.open(AddSeatComponent, {
      data: {
        canAdd: this.canAdd(x, y),
        maxCount,
        maxRow,
        sofaWidth: this.sofaWidth
      },
      header: 'Добавить места',
      width: '70%',
      height: '90%'
    })

    ref.onClose.subscribe((data: any) => {
      //console.log(data)
      if (data) {
        if (data.side === Side.RIGHT) {
          const xTo = data.countSeat ?
            x + ((data.count - 1) * this.seatWidth * data.countSeat) :
            x + ((data.count - 1) * this.seatWidth)
          this.generateRowFromTo(x, xTo, y, data.row, data.countSeat)
        }
        if (data.side === Side.LEFT) {
          const xFrom = data.countSeat ?
            x - (data.count * this.seatWidth * data.countSeat) + 1 :
            x - (data.count * this.seatWidth) + 1
          //if (data.countSeat)
          //console.log("x ", x)
          this.generateRowFromTo(xFrom, x, y, data.row, data.countSeat)
        }
        this.adjustmentSeatNumber(data.row)
      }

    })

    /*ref.onDestroy.subscribe(() => {
      //console.log("destroy")
    })*/
  }

  editSeat(index: number) {
    //console.log("edit")
    const editSeats = this.selectedSeats

    const seat = this.data[index].seat
    const editRow = seat.row
    const ref = this.dialogService.open(EditSeatComponent, {
      data: {
        row: seat.row,
        rowMax: this.hallHeight,
        price: seat.price
      },
      header: 'Edit seat',
      width: '70%',
      height: '90%'
    })

    ref.onClose.subscribe((data: any) => {
      //console.log(data)
      //console.log(this.selectedSeats)
      if (data) {
        if (editSeats.length === 0) {
          if (data.price) {
            this.data[index].seat.price = data.price
          }
          if (data.row) {
            this.data[index].seat.row = data.row
            this.adjustmentSeatNumber(data.row)
            this.adjustmentSeatNumber(editRow)
          }
          //this.data[index].seat.row = data.row
          //this.data[index].seat.price = data.price
         // this.adjustmentSeatNumber(data.row)
        } else {
          editSeats.forEach(elem => {
            if (data.row) {
              this.data[elem.index].seat.row = data.row
            }
            if (data.price) {
              this.data[elem.index].seat.price = data.price
            }
          })
          // editSeats.forEach(elem => {
          //   this.data[elem.index].seat.row = data.row
          //   this.data[elem.index].seat.price = data.price
          // })
          if (data.row) {
            this.adjustmentSeatNumber(data.row)
            this.adjustmentSeatNumber(editRow)
          }
        }
      }
    })
  }

  /*  select area start */

  startSelectArea(event: MouseEvent) {

    const middleButton = 4

    if (event.buttons === middleButton) {

      this.leftBegin = event.pageX - this.shiftContainerX
      this.topBegin = event.pageY - this.shiftContainerY

      this.isSelectArea = true

      this.selectAreaStyle = {
        width: "0px",
        height: "0px",
        left: `${this.leftBegin}px`,
        top: `${this.topBegin}px`
      }
    }

  }

  selectingArea(event: MouseEvent) {
    const middleButton = 4
    if (this.isSelectArea && event.buttons === middleButton) {
      const currX = event.pageX - this.shiftContainerX
      const currY = event.pageY - this.shiftContainerY

      let height = currY - this.topBegin
      let width = currX - this.leftBegin

      let top
      let left
      if (height < 0) {
        top = currY
        height = -height
      } else {
        top = this.topBegin
      }

      if (width < 0) {
        left = currX
        width = -width
      } else {
        left = this.leftBegin
      }

      this.selectAreaStyle = {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`
      }

      const leftBorder = left - this.scale
      const rightBorder = left + width
      const topBorder = top - this.scale
      const bottomBorder = top + height

      this.selectedSeats.forEach(({ index }) => {
        this.data[index].isSelected = false
      })

      const indexes: number[] = []
      this.selectedSeats = this.data
        .filter(({ position }, index) => {
          if ((position.x > leftBorder && position.x < rightBorder) &&
            (position.y > topBorder && position.y < bottomBorder)) {
            indexes.push(index)
            return true
          }
          return false
        })
        .map((elem, i) => {
          elem.elem!.style.zIndex = "15"
          return {
            element: elem.elem!,
            droppable: [null],
            //lastDroppable: [null],
            index: indexes[i],
            position: {
              x: elem.position.x,
              y: elem.position.y
            } //elem.position
          }
        })
      this.selectedSeats.forEach(({ index }) => this.data[index].isSelected = true)
      // this.selectedArea.forEach(elem => {
      //   elem.isSelected = false
      // })

      // this.selectedArea = this.data.filter(({position}) => 
      //   (position.x > leftBorder && position.x < rightBorder) &&
      //   (position.y > topBorder && position.y < bottomBorder)
      // )
      // this.selectedArea.forEach(elem => elem.isSelected = true)
    }
  }

  endSelectArea() {
    this.isSelectArea = false
    this.selectAreaStyle = {
      height: "",
      width: "",
      left: "",
      top: ""
    }
  }

  /* select area end*/

  save() {
    const seats: Seat[] = []

    this.data.forEach(({seat})=> seats.push(seat))

    const hallSeats: HallSeat[] = seats.map(seat => {
      return {
        x: seat.x,
        y: seat.y,
        brone: seat.brone,
        number: seat.number,
        closet: seat.closet,
        price: seat.price,
        row: seat.row,
        type: {
          countSeat: seat.type.countSeat,
          type: seat.type.type
        }
      }
    })

    const dataFetch: Hall = {
      width: this.hallWidth,
      height: this.hallHeight,
      seatWidth: this.seatWidth,
      seats: hallSeats
    }
    this.cinemaService
      .save(dataFetch)
      .subscribe()
  }

  // @HostListener('window:resize')
  // private resize() {
  //   this.shiftContainerX = Math.floor(this.adminHall.nativeElement.offsetLeft)
  //   this.shiftContainerY = Math.floor(this.adminHall.nativeElement.offsetTop)
  // }

  @HostListener('body:click', ["$event"])
  private closeContextMenu(event?: MouseEvent) {
    if (event) {
      if ((!event.shiftKey && !event.ctrlKey) && this.selectedSeats.length !== 0) {
        this.isSelectArea = false
        this.selectedSeats.forEach(({ index }) =>
          this.data[index].isSelected = false
        )
        this.selectedSeats = []
      }
    }
    if (this.contextMenuForSeatRef !== null) {
      this.contextMenuForSeatRef.classList.remove("admin-hall-context-menu-show")
      this.contextMenuForSeatRef = null
    }
    if (this.contextMenuForHallRef !== null) {
      this.contextMenuForHallRef.classList.remove("admin-hall-context-menu-show")
      this.contextMenuForHallRef = null
    }
    if (this.isSelectArea) {
      this.endSelectArea()
    }
  }

  @HostListener("body:mousedown", ["$event"])
  private body(event: MouseEvent) {
    this.startSelectArea(event)
  }

  @HostListener("body:mouseup")
  private bodyUp() {
    this.endSelectArea()
  }

  @HostListener("body:mouseleave")
  private bodyLeave() {
    this.endSelectArea()
  }
}
