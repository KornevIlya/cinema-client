import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core'

import { HallStyle } from './cinema-admin-models'
import { Seat, Single, Sofa, SeatType} from '../seat/seat-model'
import { EditSeatComponent } from './edit-seat/edit-seat.component';

import { DialogService } from 'primeng/dynamicdialog';

type Position = {
  x: number,
  y: number
}
type SelectedSeat = [
  HTMLElement, //HTMLElement который перемещаем (отрисовывает Seat)
  any[], //HTMLElement | null //целевой элемент поверх которого будет наложен Seat
  number, //индекс элемента (позиция в массиве)
  Position //координаты Seat перед началом перемещения
]

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

type SelectedRowButton = {
  row: number,
  style: SizePosition
}

type CommonStyle = {
  hall: Size
  innerElem: Size,
  //buttonContainer: Size,
  showButton: Height,
  showButtonInner: Height[]
}

@Component({
  selector: 'app-cinema-admin',
  templateUrl: './cinema-admin.component.html',
  styleUrls: ['./cinema-admin.component.scss'],
  providers: [DialogService],
})

export class CinemaAdminComponent implements OnInit, AfterViewInit {

  //ширина зала у.е.
  hallWidth: number = 16
  //длина зала у.е.
  hallHeight: number = 10
  //масштаб, ширина и высота одной клетки
  hallScale: number = 50

  seatWidth = 2
  formSeatWidth = 2

  scale: number = this.hallScale

  hallWidthCount: number[] = []
  hallHeightCount: number[] = []

  buttonVerticalHeight: {height: string} = { height: "" }

  style: CommonStyle = {
    hall: { height: "", width: "" },
    innerElem: { height: "", width: "" },
    //buttonContainer: { height: "", width: "" }
    showButton: { height: "" },
    showButtonInner: [],
  }
  
  selectRowButton: SelectedRowButton[] = []

  /* start my drag and drop */

  data: Data[] = []

  @ViewChild('adminHall')
  private adminHall!: ElementRef

  //смещение родительского контейнера относительно начала документа
  private shiftContainerX: number = 0
  private shiftContainerY: number = 0

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

  /* end my drag and drop*/

  //elemAction!: MenuItem[]
  
  private contextMenuRef: HTMLElement | null = null

  constructor(public dialogService: DialogService) { 
    //this.generateSeats()
    this.generateNewData()
    this.generateAllElements()
    this.setHeightCount()
    this.setWidthCount()
    //console.log(this.adminHall)
  }



  allElements: { height: string, width: string, top: string, left: string }[] = []

  private generateAllElements() {
    this.allElements = []
    for (let i = 0; i < this.hallHeight; i++) {
      for (let j = 0; j < this.hallWidth; j++) {
        this.allElements.push({
          width: `${this.hallScale * this.seatWidth}px`,
          height: `${(this.hallScale + Math.round(this.hallScale * 0.2)) * this.seatWidth}px`,
          left: `${j * this.scale}px`,
          top: `${i * (this.scale + Math.round(this.hallScale * 0.2))}px`
        })
      }
    }
  }

  ngOnInit(): void {
    this.setStyle()
    this.generateSelectRowButtons()

  }

  /* start my drag and drop*/ 

  private generateNewData() {
    const newData: Data[] = []

    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth

    let row = 1
    for (let i = 0; i < this.hallHeight - this.seatWidth; i += this.seatWidth) {
      newData.push(...this.generateDataRow(i, row++))
    } 
    newData.push(...this.generateDataRow(this.hallHeight - 1, row++, 2))
    this.data = newData
  }

  private generateSelectRowButtons() {
    let lastRowNumber = 0

    const selectedButtons: SelectedRowButton[] = []
    const sortedData = this.data.sort((data1, data2) => data1.seat.row - data2.seat.row )
    
    sortedData.forEach(elem => {
      if (lastRowNumber !== elem.seat.row) {
        selectedButtons.push({
          row: elem.seat.row,
          style: {
            //height: "50px",
            //width: "50px",
            top: `${elem.position.y}px`,
            left: `${-190}px`
          }
        })
        lastRowNumber = elem.seat.row
      }
    })

    this.selectRowButton = selectedButtons
  }

  ngAfterViewInit() {
    this.shiftContainerX = Math.floor(this.adminHall.nativeElement.offsetLeft)
    this.shiftContainerY = Math.floor(this.adminHall.nativeElement.offsetTop)
  }

  private moveElemTo(elem: HTMLElement, x: number, y: number): void {
    elem.style.left = `${x}px`
    elem.style.top = `${y}px`
  }

  private dropedCorrect(dragableIndex: number, droppable: HTMLElement): boolean {
    const x = parseInt(droppable.style.left)
    const y = parseInt(droppable.style.top)

    const find = this.data.find(elem => {
      const seat = elem.elem
      const position = elem.position

      const oneOfTheSelected = this.selectedSeats.find(
        ([elem]) => elem === seat
      )
      if (oneOfTheSelected) return 
      //if (seat === this.data[dragableIndex].elem) return

      //console.log(`${position.x + (this.hallScale * this.seatWidth)} ${x}`)
     
      const leftBorder = position.x - (this.hallScale * this.seatWidth)
      let rightBorder
      //const rightBorder = position.x + (this.hallScale * this.seatWidth)
      if (elem.seat.type.type === SeatType.SINGLE) {
        rightBorder = position.x + (this.hallScale * this.seatWidth)
      } else {
        rightBorder = position.x + (this.hallScale * this.seatWidth * elem.seat.type.countSeat)
      }

      const bottomBorder = position.y + ((this.hallScale) * this.seatWidth)
      const topBorder = position.y - (this.hallScale * this.seatWidth)

      //console.log(`left: ${leftBorder} right: ${rightBorder} top: ${topBorder} bottom: ${bottomBorder}`)
      //console.log(`x: ${x} y: ${y}`)
      //console.log(`px: ${position.x} py: ${position.y}`)
      //console.log(`x: ${leftBorder < x && rightBorder > x} y: ${topBorder < y && bottomBorder > y}`)
      if ( leftBorder < x && rightBorder > x ) 
        if ( topBorder < y && bottomBorder > y ) {
          //console.log(seat)
          //console.log(elem)
          //console.log(`left: ${leftBorder} right: ${rightBorder} top: ${topBorder} bottom: ${bottomBorder}`)
          return seat
        }
      
      return
    })
    //console.log(find ? true: false)
    return find ? false: true
  }

  mouseMove(event: MouseEvent) {
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
      
      
      //int
      const delX = beforeX - afterX
      const delY = beforeY - afterY

      //console.log(`${afterX} ${afterY}`)

      let localError = false

      for (let i = 0; i < this.selectedSeats.length; i++) {
        let [selected, droppableArray, index, initPoint] = this.selectedSeats[i]
        //console.log(droppable)
        //let droppable = droppableArray[0]

        //fint
        let targetX = this.shiftCursorX
        let targetY = this.shiftCursorY

        ///console.log(targetX + " " + targetY)

        if (selected !== this.movableSeat) {

          const moveToX = this.data[index].position.x - delX
          const moveToY = this.data[index].position.y - delY
          //console.log(moveToX + " " + moveToY)
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
       

        if (droppableArray.length === 1) {

          selected.style.visibility = "hidden"
          //смотрим элемент под сиденем (перетаскиваемый объект)
          //console.log(targetX)
          let elemBelow = document.elementFromPoint(targetX + this.shiftContainerX, targetY + this.shiftContainerY)
          //selected.hidden = false
          //console.log(`${targetX + this.shiftContainerX} ${targetY + this.shiftContainerY}`)
          selected.style.visibility = ""

          let droppable = droppableArray[0]

          /**if (droppableArray)
           droppable.style.zIndex = ""*/
          if (!elemBelow) return

          let droppableBelow = elemBelow.closest('.dropable')
          
          if (droppableBelow === null) {
            //console.log("null")
            localError = true
          } else {
            if (!this.dropedCorrect(index, droppableBelow as HTMLElement)){
              droppableBelow = null
              localError = true
            }
          }
          if (droppable != droppableBelow) {
            if (droppable) {
                // логика обработки процесса "вылета" из droppable (удаляем подсветку)
              droppable!.firstChild.style.backgroundColor = ''
              droppable.style.zIndex = ''
            }
            droppable = droppableBelow;
            if (droppable) {
              // логика обработки процесса, когда мы "влетаем" в элемент droppable
              droppable.firstChild.style.backgroundColor = 'red'
              droppable.style.zIndex = '5'
            }
          }

          this.selectedSeats[i] = [selected, [droppable], index, initPoint]
        } else {
          const newDroppable: any[] = []
         /* selected.style.visibility = "hidden"
          //смотрим элемент под сиденем (перетаскиваемый объект)
          let elemBelow = document.elementFromPoint(targetX + this.shiftContainerX, targetY + this.shiftContainerY)
          selected.style.visibility = ""*/
          const shiftN = Math.floor(this.shiftCursorX / (this.scale * this.seatWidth))
          const delShiftX = this.shiftCursorX - (shiftN * this.scale * this.seatWidth)
          //console.log(delShiftX)
          const leftCoordinate = selected.offsetLeft
          //console.log(leftCoordinate)

          /*const innerSize = Math.round(this.scale * 0.8)
          const innerWidth = innerSize * this.seatWidth*/
          droppableArray.forEach((droppable, index) => {
          
            const currShiftX = leftCoordinate + (delShiftX + ( this.scale * 2 * index))

            //console.log(currShiftX + " " + index)

            selected.style.visibility = "hidden"
            /*this.selectedSeats.forEach(selected => {
              const [htmlElem] =  selected
              htmlElem.style.visibility = "hidden"
            })*/
            //смотрим элемент под сиденем (перетаскиваемый объект)
            let elemBelow = document.elementFromPoint(currShiftX + this.shiftContainerX, targetY + this.shiftContainerY)
            //console.log(`${currShiftX + this.shiftContainerX} ${targetY + this.shiftContainerY}`)
            selected.style.visibility = ""

            /*this.selectedSeats.forEach(selected => {
              const [htmlElem] =  selected
              htmlElem.style.visibility = ""
            })*/
            if (!elemBelow) return

            let droppableBelow = elemBelow.closest('.dropable')
            
            if (droppableBelow === null) {
              localError = true
            } else {
              if (!this.dropedCorrect(index, droppableBelow as HTMLElement)){
                droppableBelow = null
                localError = true
              }
            }
            if (droppable != droppableBelow) {
              if (droppable) {
                  // логика обработки процесса "вылета" из droppable (удаляем подсветку)
                droppable!.firstChild.style.backgroundColor = ''
                droppable.style.zIndex = ''
              }
              droppable = droppableBelow;
              if (droppable) {
                // логика обработки процесса, когда мы "влетаем" в элемент droppable
                droppable.firstChild.style.backgroundColor = 'red'
                droppable.style.zIndex = '5'
              }
            }

            newDroppable.push(droppable)
          })
          this.selectedSeats[i] = [selected, newDroppable, index, initPoint]
        }
      }

      this.movableError = localError

    }
  }

  //инициализирует перемещение
  mouseDown(event: MouseEvent, index: number) {
    const leftButton = 0

    if (event.button === leftButton) {
    
       //если не нажата клавиша ctrl, то можем перемещать выбранные элементы
      if (!event.ctrlKey) {
        this.isMovable = true
      }

      const seat =  this.data[index].elem!
      this.data[index].isSelected = true
      //seat.style.visibility = 'hidden'

      const init: Position = {
        x: this.data[index].position.x,
        y: this.data[index].position.y
      }

      const findSomeElem = this.selectedSeats.find(([selected, target, i]) => i === index)
      if (!findSomeElem) {
        if (this.data[index].seat.type.type === SeatType.SINGLE) {
          this.selectedSeats.push([seat, [null], index, init])
        } else {
          const dropable: any[] = []
          for (let i = 0; i < this.data[index].seat.type.countSeat; i++) {
            dropable.push(null)
          }
          this.selectedSeats.push([seat, dropable, index, init])
        }
      }
        

      seat.style.zIndex = "15"
      //console.log(this.selectedSeats)
      this.movableSeat = seat
      //мещение курсора внутри сиденья
      this.shiftCursorX = Math.floor(event.clientX) - Math.floor(seat.getBoundingClientRect().left)
      this.shiftCursorY = Math.floor(event.clientY) - Math.floor(seat.getBoundingClientRect().top)
    }

  }

  mouseUp(event: MouseEvent, index: number) {
    //console.log("mouse up")

    const leftButton = 0 
    if (event.button === leftButton) {
      this.isMovable = false
      
      if (!event.ctrlKey) {
        //this.data[index].isSelected = false
        this.selectedSeats.forEach(([selected, target, i, initPoint]) => {
  
          selected.style.zIndex = ""
          
          this.data[i].isSelected = false
          /*if (target){
            target.firstChild.style.backgroundColor = ''
            target.style.zIndex = ""
          }*/
          target.forEach(elem => {
            if(elem !== null) {
              elem.firstChild.style.backgroundColor = ''
              elem.style.zIndex = ""
            }
          })
  
          if (this.movableError) {
            selected.style.left = `${initPoint.x}px`,
            selected.style.top = `${initPoint.y}px`
  
            this.data[i].position = initPoint
  
          } else {
              if(target[0]) {
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
              }
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
      this.isSelectedRow = false
    }
  }


  private checkSeatAfterMove() {
    if (this.selectedSeats.length === 1) {
      const [elem, droppable, index, position] = this.selectedSeats[0]
      const currSeat = this.data[index].seat

      const leftSeats: Data[] = []
      const rightSeats: Data[] = []

      this.data.forEach(elem => {
        if (elem.seat.row === currSeat.row) {
          if (elem.seat.x < currSeat.x) {
            leftSeats.push(elem)
          }
          if (elem.seat.x > currSeat.x) {
            rightSeats.push(elem)
          } 
        }
      });

      if (leftSeats.length > 0) {
        let maxX = leftSeats[0].seat.x
        let numberForMaxX = leftSeats[0].seat.number
        for (let i = 1; i < leftSeats.length; i++) {
          if (leftSeats[i].seat.x > maxX) {
            maxX = leftSeats[i].seat.x
            numberForMaxX = leftSeats[i].seat.number
          }
        }

        if (numberForMaxX > currSeat.number) {
          let newNumber = 1
          leftSeats
            .sort((a, b) => a.seat.x - b.seat.x)
            .forEach(({ seat }) => {
              seat.number = newNumber++
            }) 
            currSeat.number = newNumber
        } else {
          currSeat.number = numberForMaxX + 1
        }
        //currSeat.number = numberForMaxX
      } else {
        currSeat.number = 1
      }

      //currSeat.number++
    
      let numberForRightSeats = currSeat.number + 1
      rightSeats
        .sort((a, b) => a.seat.x - b.seat.x)
        .forEach(({ seat }) => {
          seat.number = numberForRightSeats++
        })
    } 

    if (this.isSelectedRow) {
      const rows = new Map<number, Seat[]>()

      this.data.forEach(({ seat }) => {
        const seatsGroup = rows.get(seat.row)
        if (seatsGroup) {
          seatsGroup.push(seat)
          rows.set(seat.row, seatsGroup)
        } else {
          rows.set(seat.row, [seat])
        }
      })

      const sortedRows = new Map<number, Seat[]>(
        [...rows.entries()].sort((a, b) => {
          const [rowA, seatsA] = a
          const [rowB, seatsB] = b
          return seatsA[0].y - seatsB[0].y
        })
      )

      let newRow = 1
      //let index = 0
      this.selectRowButton = []
      sortedRows.forEach((value) => {
        //this.selectRowButton[index++].row = newRow
        this.selectRowButton.push({
          row: newRow,
          style: {
            top: `${(value[0].y - 1)* (this.scale + Math.round(this.scale * 0.2))}px`,
            left: `${-190}px`
          }
        })
        value.forEach(seat => {
          seat.row = newRow
        })
        newRow++
      })
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

  private convertToCoordinate(left: string, top: string): Position {
    const position: Position = {
      x: parseInt(left) / (this.hallScale) + 1,
      y: parseInt(top) / (this.hallScale + Math.round(this.hallScale * 0.2)) + 1
    }

    return position
  }

  //прерываем нативный drag and drop
  dragStart() {
    return false
  }

  selectRow(row: number) {

    this.isSelectedRow = true
    const findElem = this.data.find(({seat}) => seat.row === row)

    const dropable: any[] = []
    for (let i = 0; i < findElem!.seat.type.countSeat; i++) {
      dropable.push(null)
    }

    this.data.forEach((elem, index) => {
      if (elem.seat.row === row) {
        this.data[index].isSelected = true

        this.selectedSeats.push([
          elem.elem!,
          dropable,
          index,
          {
            x: elem.position.x,
            y: elem.position.y,
          }
        ])
      }
    })
  }

  setElem(elem: HTMLElement | null, index: number) {
    this.data[index].elem = elem
  } 
  /* end my drag and drop*/


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
      showButton: {
        height: `${this.hallScale + Math.round(this.hallScale * 0.2)}px`
      },
      showButtonInner: this.generateShowButtonInnerStyle()
  
    }
    this.buttonVerticalHeight = {
      height: `${(this.hallScale + Math.round(this.hallScale * 0.2))}px`
    }
  }

  private generateShowButtonInnerStyle(): Height[] {
    const style: Height[] = []

    for (let i = 0; i < this.hallHeight; i++) {
      style.push({height: `${this.hallScale}px`})
    }

    return style
  }

  updateState() {
    this.scale = this.hallScale
    this.seatWidth = this.formSeatWidth
    this.setWidthCount()
    this.setHeightCount()
    this.generateNewData()
    this.generateSelectRowButtons()
    this.generateAllElements()
    this.setStyle()
  }
  
  private setHeightCount() {
    console.log("height")
    const hallHeightCount: number[] = []
    for (let i = 0; i < this.hallHeight; i++) {
      hallHeightCount.push(i)
    }
    this.hallHeightCount = hallHeightCount
  }

  private setWidthCount() {
    console.log("width")
    const hallWidthCount: number[] = []
    for (let i = 0; i < this.hallWidth; i++) {
      hallWidthCount.push(i)
    }
    this.hallWidthCount = hallWidthCount
  }

  generateDataRow(index: number, row: number, countSeat?:number): Data[] {
    const coordinateY = index + 1
    const dataRow: Data[] = []

    const innerSize = Math.round(this.scale * 0.8)
    const innerWidth = innerSize * this.seatWidth

    const del = countSeat ? this.seatWidth * countSeat : this.seatWidth

    const end = countSeat ? this.hallWidth - countSeat : this.hallWidth
    for (let i = 0, seatNumber = 1 ; i < end; i += del, seatNumber++) {
      dataRow.push({ 
        seat: {
          x: i + 1,
          y: coordinateY,
          row: row,
          number: seatNumber,
          type: countSeat ? new Sofa(countSeat) : new Single()
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

    this.selectRowButton.push({
      row: row,
      style: {
        top: `${index * (this.hallScale + Math.round(this.hallScale * 0.2))}px`,
        left: `${-190}px`
      }
    })
    return dataRow
  }
  
  
  deleteRow(index: number): void {
    const coordinate = index + 1

    const currentRow = this.data.find(({ seat }) => seat.y === coordinate)
    if(currentRow) {
      this.selectRowButton = this.selectRowButton
      .filter(({ row }) => row !== currentRow!.seat.row)
      .map(elem => {
        if (elem.row > currentRow!.seat.row) {
          elem.row--
          return elem
        }
        return elem
      })

      this.data = this.data
      .filter(({ seat} ) => seat.y !== coordinate)
      .map(elem => {
        if (elem.seat.row > currentRow!.seat.row) {
          elem.seat.row--
          return elem
        }
        return elem
      })
    }
    

    //this.generateSelectRowButtons()
  }

  addRow(index: number, countSeat?: number): void {
    const coordinate = index + 1

    if (index <= this.hallHeight) {
      const haveRow = this.data.find(
        ({ seat }) => seat.y < coordinate + this.seatWidth && seat.y > coordinate - this.seatWidth
      )
      if (!haveRow) {
        const rowUnderGeterated = this.data.filter(({ seat }) => seat.y > coordinate)
        //console.log(rowUnderGeterated)
        let newRow = 0
        if(rowUnderGeterated.length > 0) {
          let minRow = rowUnderGeterated[0].seat.row
          rowUnderGeterated.forEach(({ seat }) => {
            if (seat.row < minRow) {
              minRow = seat.row
            }
            seat.row = seat.row  + 1
          })
          newRow = minRow
        } else {
          if (this.selectRowButton.length === 0) {
            newRow = 1
          } else {
            const sorted = this.selectRowButton.sort((a, b) => b.row -  a.row)
            //console.log(sorted)
            newRow = sorted[0].row + 1
          }
        }
        
        //проверить эффективность
        this.generateSelectRowButtons()
        this.data.push(...this.generateDataRow(index, newRow, countSeat))
        
        //this.seats = this.seats.concat(this.generateRowSeats(1, this.hallWidth, coordinate))
      }
    }
  }

  showButtons(ref: HTMLDivElement) {
    ref.classList.toggle("admin-hall-buttons-show-show")
  } 

  contextMenu(event: MouseEvent, contextMenu: HTMLElement) {
    event.preventDefault()

    const rightButton = 2

    const shiftCursorX = Math.floor(event.clientX) - this.shiftContainerX
    const shiftCursorY = Math.floor(event.clientY) - this.shiftContainerY

    if (event.button === rightButton) {
      this.closeContextMenu()
      contextMenu.classList.add("admin-hall-context-menu-show")
      contextMenu.style.left = `${shiftCursorX}px`
      contextMenu.style.top = `${shiftCursorY}px`
      this.contextMenuRef = contextMenu
    }
  }

  deleteSeat(index: number) {
    this.closeContextMenu()

    const removeSeat = this.data[index].seat
    this.data.splice(index, 1)

    this.data.forEach(({ seat }) => {
      if (seat.row === removeSeat.row) {
        if (seat.number > removeSeat.number) {
          seat.number--
        }
      }
    })
    
  }
  
  /*editSeat(index: number) {
    const seat = this.data[index].seat

    const ref = this.dialogService.open(EditSeatComponent, {
      data: {
        seat,
        
      },
      header: 'Edit seat',
      width: '70%',
    })

    ref.onClose.subscribe((data: any) => {
      console.log(data)
    })
  }*/

  @HostListener('window:resize')
  resize() {
    this.shiftContainerX = Math.floor(this.adminHall.nativeElement.offsetLeft)
    this.shiftContainerY = Math.floor(this.adminHall.nativeElement.offsetTop)
  }

  @HostListener('body:click') 
  closeContextMenu() {
    if(this.contextMenuRef !== null) {
      this.contextMenuRef.classList.remove("admin-hall-context-menu-show")
      this.contextMenuRef = null
    }

  }
}
