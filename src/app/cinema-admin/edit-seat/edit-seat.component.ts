import { Component, OnInit, OnDestroy } from '@angular/core'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

//import { SeatCategory } from 'src/app/seat/seat-model';

@Component({
  selector: 'app-edit-seat',
  templateUrl: './edit-seat.component.html',
  styleUrls: ['./edit-seat.component.scss']
})

export class EditSeatComponent implements OnInit, OnDestroy {

  //x: number
  //y: number
  row: number
  isEditRow: boolean = false
  //number: number
  rowMax: number

  price: number
  isEditPrice: boolean = false

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { 

    //this.x = this.config.data.seat.x
    //this.y = this.config.data.seat.y
    this.row = this.config.data.row
    this.rowMax = this.config.data.rowMax

    this.price = this.config.data.price
    //this.number = this.config.data.seat.number

  }

  ngOnInit(): void {
    //this.ref.destroy()
  }
  ngOnDestroy(): void {
    //this.ref.close(/*data*/)
  }

  ok() {
    this.ref.close({
      //x: this.x,
      //y: this.y,
      row: this.isEditRow ? this.row : undefined,
      price: this.isEditPrice ? this.price : undefined
      //number: this.number
    })
  }
  close() {
    this.ref.close()
  }
}
