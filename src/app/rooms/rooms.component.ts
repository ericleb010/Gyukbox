import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Room } from '../shared/models';
import { RoomService } from '../shared/services/room.service';
import { YoutubeService } from './services/youtube.service';
import { SocketService } from './services/socket.service';

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
  roomUpdate: Subject<Room[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private roomService: RoomService,
    private youtubeService: YoutubeService,
  ) {

    this.activatedRoute.params.forEach((parameters: Params) => {
      console.log(parameters);

      const rooms$ = this.roomService.updateCurrentRoom(parameters['id']);
      if (this.roomService.currentRoomList === undefined) {
        rooms$.subscribe(() => {
          console.log('currentRoom: ' + this.roomService.currentRoom);
          this.currentRoom = this.roomService.currentRoom;
        });

        console.log(rooms$);
        rooms$.connect();
      } else {
        this.currentRoom = this.roomService.currentRoom;
      }
    });

  }

  ngOnInit() {
    this.initializeSocket();
  }

  addVideo() {
    this.videoAdded.next(this.videoId);
    this.updateTitle();
  }

  private initializeSocket() {
    this.socketService.initSocket();
    this.socketService.send('join', {room: 'test', username: '' });
  }

  private updateTitle() {
    this.youtubeService.getVideoDetails(this.videoId).subscribe(videoDetails => {
      this.videoTitle = this.youtubeService.getVideoTitle(videoDetails);
    });
  }
}
