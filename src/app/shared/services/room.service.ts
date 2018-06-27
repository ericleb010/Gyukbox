import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models';

const HEADER = new HttpHeaders().set('Content-Type', 'application/json');
const HOST = `${environment.apiHost}:${environment.apiPort}`;

@Injectable()
export class RoomService {

  public currentRoom: Room;
  private _roomList: Room[];

  public get currentRoomList(): Room[] {
    return this._roomList;
  }

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  public getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('http://' + HOST + '/api/rooms/all').map((roomsJSON: Room[]): Room[] => {
      this._roomList = roomsJSON.map((roomJSON) => new Room(roomJSON));
      return this._roomList;
    });
  }

  public updateCurrentRoom(id: string) {
    const rooms$ = this.roomService.getRooms();

    rooms$.subscribe((rooms: Room[]) => {
      this._roomList = rooms;
      this.currentRoom = this._roomList.find((room) => room.id === id);
    });
  }
}
