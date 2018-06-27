import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Room } from '../shared/models';
import { RoomService } from '../shared/services/room.service';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'gyukbox-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  videoId: string;
  videoAdded: Subject<string> = new Subject<string>();
  videoTitle = '';
  currentRoom: Room;

  constructor(
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private youtubeService: YoutubeService,
  ) {
    this.activatedRoute.paramMap.subscribe(() => {
      // TODO Check for new room IDs
    });
  }

  ngOnInit() {}

  addVideo() {
    this.videoAdded.next(this.videoId);
    this.updateTitle();
  }

  private updateTitle() {
    this.youtubeService.getVideoDetails(this.videoId).subscribe(videoDetails => {
      this.videoTitle = this.youtubeService.getVideoTitle(videoDetails);
    });
  }
}
