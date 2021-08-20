import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeatComponent } from './seat/seat.component';
import { CinemaAdminComponent } from './cinema-admin/cinema-admin.component';
import { EditSeatComponent } from './cinema-admin/edit-seat/edit-seat.component';
import { AddSeatComponent } from './cinema-admin/add-seat/add-seat.component'

import { ContextMenuModule } from 'primeng/contextmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DragDropModule } from 'primeng/dragdrop';
import { SpeedDialModule } from 'primeng/speeddial';
import { SelectButtonModule } from 'primeng/selectbutton'
import { CinemaClientComponent } from './cinema-client/cinema-client.component';

@NgModule({
  declarations: [
    AppComponent,
    SeatComponent,
    CinemaAdminComponent,
    EditSeatComponent,
    AddSeatComponent,
    CinemaClientComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ContextMenuModule,
    InputNumberModule,
    ButtonModule,
    DynamicDialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    DragDropModule,
    SpeedDialModule,
    SelectButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
