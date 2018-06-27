import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Room } from '../shared/models';
import { RoomService } from '../shared/services/room.service';

@Component({
  selector: 'gyukbox-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss'],
})
export class RoomSelectorComponent implements OnInit {

  selectedRoomID: string;
  rooms: Room[];

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit() {
    const rooms$ = this.roomService.getRooms();

    rooms$.subscribe((rooms: Room[]) => {
      console.log(JSON.stringify(rooms));
      this.rooms = rooms;
    });
    rooms$.connect();
  }

  public chooseRoom = function(event, id: string) {
    this.roomService.updateCurrentRoom(id);
    this.router.navigateByUrl(`/rooms/${id}`);
  };
}
