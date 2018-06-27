import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'selectRoom',
    loadChildren: 'app/roomSelector/roomSelector.module#RoomSelectorModule'
  },
  {
    path: 'rooms',
    loadChildren: 'app/rooms/rooms.module#RoomsModule'
  },
  {
    path: '',
    redirectTo: '/selectRoom',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
