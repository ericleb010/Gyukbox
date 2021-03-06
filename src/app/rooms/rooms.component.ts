import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Room } from '../shared/models';
import { RoomService } from '../shared/services/room.service';
import { YoutubeService } from './services/youtube.service';
import { SocketService } from './services/socket.service';
import { Action } from '../shared/models/socketEvents';

@Component({
  selector: 'gyukbox-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  playNext: Subject<{ songId: string, offset: number }> = new Subject<{ songId: string, offset: number }>();
  videoTitle = '--';
  currentRoom: Room;
  roomUpdate: Subject<Room[]>;
  currentQueue: any[];
  queueUpdate: Subject<any[]>;
  searchOpen = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private roomService: RoomService,
    private youtubeService: YoutubeService,
    private renderer: Renderer2,
  ) {
    this.renderer.addClass(document.body, 'gyukbox');

    this.activatedRoute.params.forEach((parameters: Params) => {
      const rooms$ = this.roomService.updateCurrentRoom(parameters['id']);
      if (this.roomService.currentRoomList === undefined) {
        rooms$.subscribe(() => {
          console.log('currentRoom: ' + this.roomService.currentRoom);
          this.currentRoom = this.roomService.currentRoom;
        });

        rooms$.connect();
      } else {
        this.currentRoom = this.roomService.currentRoom;
      }
    });

  }

  ngOnInit() {
    this.socketService.initSocket();
    this.socketService.send(Action.JOIN, { room: this.currentRoom, username: '' });

    this.socketService.onAction(Action.QUEUE).subscribe((queueObj) => {
      const list: any[] = queueObj.queue;
      console.log('Received song list: ', list);
      this.currentQueue = list.map((song) => {
        const mins = Math.floor(song.songLength / 60000);
        const secs = (song.songLength / 1000) % 60;
        console.log(mins, ' ', secs);
        song.songLength = mins + ':' + ((secs >= 10) ? '' : '0') + secs;
        return song;
      });
    });

    this.socketService.onAction(Action.PLAY_SONG).subscribe(data => {
      if (data.songId && data.offset !== undefined) {
        this.videoTitle = data.songTitle;
        this.playNext.next({
          songId: data.songId,
          offset: data.offset
        });
      }
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'gyukbox');
  }

  addVideo(event: string) {
    this.searchOpen = false;

    this.youtubeService.getVideoDetails(event).subscribe(videoDetails => {
      const songData = {
        songId: event,
        songTitle: this.youtubeService.getVideoTitle(videoDetails),
        songLength: this.youtubeService.getVideoLength(videoDetails),
        offset: 0,
      };
      this.socketService.send(Action.ADD_SONG, songData);
    });
  }

  playerLoaded() {
    console.log("LOADED");
    this.socketService.initSocket();
    this.socketService.send(Action.JOIN, { room: this.currentRoom, username: '' });

    this.socketService.onAction(Action.PLAY_SONG).subscribe(data => {
      console.log(data);
      if (data.songId && data.offset !== undefined) {
        this.playNext.next({
          songId: data.songId,
          offset: data.offset
        });
      }
    });
  }

  openSearch() {
    this.searchOpen = true;
  }
}

