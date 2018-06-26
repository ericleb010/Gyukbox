import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  imports: [
    CommonModule,
    RoomsRoutingModule
  ],
  declarations: [
    RoomsComponent,
    VideoPlayerComponent,
  ]
})
export class RoomsModule { }
