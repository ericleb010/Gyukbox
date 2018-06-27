import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { SocketService } from './socket.service';
import { Action } from '../../shared/models/socketEvents';

@Injectable()
export class SongService {

  songQueueSubject: Subject<any[]> = new Subject<any[]>();

  /*
  {
    songId: event,
    songTitle: this.videoTitle,
    songLength: this.youtubeService.getVideoLength(videoDetails),
    offset: 0,
  }
  */

  private songList: any[] = [];

  constructor(private socketService: SocketService) { }

}
