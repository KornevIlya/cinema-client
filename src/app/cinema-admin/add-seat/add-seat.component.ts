import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

import { Side } from './add-seat-model';
import { SeatType } from 'src/app/seat/seat-model';
@Component({
  selector: 'app-add-seat',
  templateUrl: './add-seat.component.html',
  styleUrls: ['./add-seat.component.scss']
})
export class AddSeatComponent implements OnInit {

  row: number = 1
  count: number = 0
  maxRow: number
  maxCount: number

  selectSideOption: Side = Side.RIGHT
  sideOptions: any[] = [
    {label: 'Справа', value: Side.RIGHT},
    {label: 'Слева', value: Side.LEFT},
  ]

  selectSeatType: SeatType = SeatType.SINGLE
  seatTypeOption: any[] = [
    { label: 'Одиночное место', value: SeatType.SINGLE },
    { label: 'Диван', value: SeatType.SOFA },
  ]

  countSeat: number = 2

  isShow: boolean = false

  classStyle: string = ""
  private classError:string = "ng-invalid ng-dirty"
  
  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { 
    this.maxCount = this.config.data.maxCount
    this.maxRow = this.config.data.maxRow
  }

  ngOnInit(): void {
  }

  onFocus(): void {
    this.classStyle = ""
  }

  changeSeatType() {
    if (this.selectSeatType == SeatType.SOFA) {
      this.isShow = true
    } else {
      this.isShow = false
    }
  }

  createSeat(): void {
    //console.log(this.selectOption)
    //console.log(this.config.data.canAdd(this.row, this.count, this.selectOption))
    const canAdd = this.selectSeatType === SeatType.SINGLE ? 
      this.config.data.canAdd(this.row, this.count, this.selectSideOption):
      this.config.data.canAdd(this.row, this.count, this.selectSideOption, this.countSeat)
      
    if (canAdd) {
      if (this.selectSeatType === SeatType.SINGLE) {
        this.ref.close({
          row: this.row,
          count: this.count,
          side: this.selectSideOption
        })
      } else {
        this.ref.close({
          row: this.row,
          count: this.count,
          side: this.selectSideOption,
          countSeat: this.countSeat
        })
      }
        
    } else {
      this.classStyle = this.classError
    }
    
  }
}
