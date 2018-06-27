import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { YoutubeService } from './services/youtube.service';
import { SocketService } from './services/socket.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RoomsRoutingModule,
  ],
  declarations: [
    RoomsComponent,
    SafePipe,
    VideoPlayerComponent,
  ],
  providers: [
    SocketService,
    YoutubeService,
  ]
})
export class RoomsModule { }
