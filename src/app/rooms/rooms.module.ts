import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { SafePipe } from '../shared/pipes/safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    RoomsRoutingModule
  ],
  declarations: [
    RoomsComponent,
    SafePipe,
    VideoPlayerComponent,
  ]
})
export class RoomsModule { }
