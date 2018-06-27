import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'gyukbox-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
  videoId: string;
  videoAdded: Subject<string> = new Subject<string>();
  videoTitle = '';

  constructor(private youtubeService: YoutubeService) { }

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
