import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

const BASE_URL = 'https://www.youtube.com/embed/';
const PARAMS = '?controls=0&disablekb=1&modestbranding=1&showinfo=0&iv_load_policy=3&start=0&enablejsapi=1&rel=0';

@Component({
  selector: 'gyukbox-video-player',
  templateUrl: './video-player.html',
  styleUrls: ['./video-player.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoAdded: Subject<string>;

  videoId = 'ASf25UGveBQ';

  YT: any;
  video: any;
  player: any;
  videoUrl = this.buildYoutubeUrl(this.videoId);

  constructor() { }

  ngOnInit() {
    this.init();
    this.video = '1cH2cerUpMQ'; // video id

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.player = new window['YT'].Player('player', {
        videoId: this.video,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
        },
      });
    };

    this.videoAdded.subscribe(videoId => {
      this.videoId = videoId;
      console.log(this.videoId);
      this.player.loadVideoById(this.videoId);
      this.player.playVideo();
    });
  }

  init() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  buildYoutubeUrl(videoId: string) {
    return BASE_URL + videoId + PARAMS;
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
