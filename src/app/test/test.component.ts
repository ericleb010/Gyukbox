import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gyukbox-test',
  template: `
  <iframe id="player"
    width="640"
    height="360"
    src="https://www.youtube.com/embed/ASf25UGveBQ?controls=0&disablekb=1&modestbranding=1&showinfo=0&iv_load_policy=3&start=0&enablejsapi=1&rel=0"
    frameborder="0"
    style="border: solid 4px #37474F"
  ></iframe>
  `,
  styles: [`.max-width-1024 { max-width: 1024px; margin: 0 auto; }`],
})
export class TestComponent implements OnInit {
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;
  constructor() { }
  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnInit() {
    this.init();
    this.video = '1cH2cerUpMQ' //video id

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = false;
      this.player = new window['YT'].Player('player', {
        videoId: this.video,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
        },
        config: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            showinfo: 0,
            iv_load_policy: 3
        }
      });
      window['YT'].config = {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3
      };
    };
  }

  onPlayerStateChange(event) {
    console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    };
  };
  //utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };
}