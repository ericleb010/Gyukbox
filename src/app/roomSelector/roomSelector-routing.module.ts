import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomSelectorComponent } from './room-selector.component';

const routes: Routes = [{ path: '', component: RoomSelectorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
