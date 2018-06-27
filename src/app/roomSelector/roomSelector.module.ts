import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RoomSelectorComponent } from './room-selector.component';

import { RoomsRoutingModule } from './roomSelector-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RoomsRoutingModule,
  ],
  declarations: [
    RoomSelectorComponent
  ],
  providers: []
})
export class RoomSelectorModule { }
