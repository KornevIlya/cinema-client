import { Component, OnInit, OnDestroy } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

import { SeatCategory } from 'src/app/seat/seat-model';

@Component({
  selector: 'app-edit-seat',
  templateUrl: './edit-seat.component.html',
  styleUrls: ['./edit-seat.component.scss']
})

export class EditSeatComponent implements OnInit, OnDestroy {

  x: number
  y: number

  category: any
  //categories: SeatCategory[]
  categories = [{
    label: "свободно",
    category: SeatCategory.FREE,
  }, {
    label: "выбрано",
    category: SeatCategory.SELECTED,
  }, {
    label: "куплено",
    category: SeatCategory.BOUGTH,
  }, {
    label: "забронировано",
    category: SeatCategory.BLOCKED,
  }, {
    label: "не активно",
    category: SeatCategory.NO_ACTIVE,
  },]


  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { 

    /*this.categories = [
      SeatCategory.FREE,
      SeatCategory.SELECTED,
      SeatCategory.BOUGTH,
      SeatCategory.BLOCKED,
      SeatCategory.NO_ACTIVE
    ]*/

    console.log("constructor")
    this.category = {label: "", category: config.data.seat.category}
    console.log(this.category)
    this.x = config.data.seat.x
    this.y = config.data.seat.y
    this.category = config.data.seat.category
    //console.log(ref)
    //console.log(config)
  }

  ngOnInit(): void {
    //this.ref.destroy()
  }
  ngOnDestroy(): void {
    //this.ref.close(/*data*/)
  }

  ok() {
    console.log("ok")
    console.log(this.category)
    this.ref.close({
      x: this.x,
      y: this.y,
      category: this.category.category,
      isDelete: false
    })
  }

  deleteElem() {
    this.ref.close({
      isDelete: true
    })
  }

  close() {
    this.ref.close()
  }
}
