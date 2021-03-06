import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { YoutubeService } from '../services/youtube.service';

const PLAYER_BASE_URL = 'https://www.youtube.com/embed/';
const PLAYERS_PARAMS = '?controls=0&disablekb=1&modestbranding=1&showinfo=0&iv_load_policy=3&start=0&enablejsapi=1&rel=0';

@Component({
  selector: 'gyukbox-video-player',
  templateUrl: './video-player.html',
  styleUrls: ['./video-player.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() playNext: Subject<{ songId: string, offset: number }>;
  @Output() playerLoaded = new EventEmitter<boolean>();

  videoId = '8tPnX7OPo0Q';
  offset = 0;
  YT: any;
  video: any;
  player: any;
  videoUrl = this.buildYoutubePlayerUrl(this.videoId, this.offset);
  apiReady = false;

  constructor() { }

  ngOnInit() {
    this.init();

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.player = new window['YT'].Player('player', {
        events: {
          'onReady': this.playerLoaded.emit(true),
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
        },
      });
    };

    this.playNext.subscribe(video => {
      console.log(video);
      this.videoId = video.songId;
      this.offset = video.offset;
      setTimeout(() => {
        this.player.loadVideoById(this.videoId);
        this.player.playVideo();
      }, 1000);
    });

  }

  init() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  buildYoutubePlayerUrl(videoId: string, offset: number) {
    return PLAYER_BASE_URL + videoId + PLAYERS_PARAMS;
  }

  onPlayerStateChange(event) {
    console.log(event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }
  // utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }
}
