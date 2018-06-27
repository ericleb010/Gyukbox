import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomSelectorComponent } from './room-selector.component';

import { RoomsRoutingModule } from './roomSelector-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RoomsRoutingModule,
  ],
  declarations: [
    RoomSelectorComponent
  ],
  providers: []
})
export class RoomSelectorModule { }
