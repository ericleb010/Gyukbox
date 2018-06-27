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
  videoId: string;
  playNext: Subject<{ songId: string, offset: number }> = new Subject<{ songId: string, offset: number }>();
  videoTitle = '--';
  currentRoom: Room;
  roomUpdate: Subject<Room[]>;
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
    this.activatedRoute.params.forEach((parameters: Params) => {
      this.roomService.updateCurrentRoom(parameters['id']).subscribe(() => {
        this.initializeSocket();

        this.socketService.onAction(Action.PLAY_SONG).subscribe(data => {
          if (data.songId && data.offset) {
            this.playNext.next({
              songId: data.songId,
              offset: data.offset
            });
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'gyukbox');
  }

  addVideo(event: string) {
    this.searchOpen = false;
    this.videoId = event;

    this.youtubeService.getVideoDetails(this.videoId).subscribe(videoDetails => {
      this.videoTitle = this.youtubeService.getVideoTitle(videoDetails);
      const songData = {
        songId: this.videoId,
        songTitle: this.videoTitle,
        songLength: this.youtubeService.getVideoLength(videoDetails),
        offset: 0,
      };
      this.socketService.send(Action.ADD_SONG, songData);
    });
  }
  
  openSearch() {
    this.searchOpen = true;
  }

  private initializeSocket() {
    this.socketService.initSocket();
    this.socketService.send(Action.JOIN, { room: this.currentRoom, username: '' });
  }
}

