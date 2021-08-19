import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

import { Side } from './add-seat-model';

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

  selectOption: any = Side.LEFT
  options: any[] = [
    {label: 'Справа', value: Side.RIGHT},
    {label: 'Слева', value: Side.LEFT},
  ]

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

  createSeat(): void {
    //console.log(this.selectOption)
    //console.log(this.config.data.canAdd(this.row, this.count, this.selectOption))
    const canAdd = this.config.data.canAdd(this.row, this.count, this.selectOption)
    if (canAdd) {
      this.ref.close({
        row: this.row,
        count: this.count,
        side: this.selectOption
      })
    } else {
      this.classStyle = this.classError
    }
    
  }
}
