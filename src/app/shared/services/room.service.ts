import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, ConnectableObservable, Subject } from 'rxjs';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/map';

import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models';

const HEADER = new HttpHeaders().set('Content-Type', 'application/json');
const HOST = `${environment.apiHost}:${environment.apiPort}`;

@Injectable()
export class RoomService {

  public currentRoom: Room;
  private _roomList: Room[];
  private _roomListUpdated: Subject<Room[]> = new Subject<Room[]>();

  public get roomListUpdated(): Subject<Room[]> {
    return this._roomListUpdated;
  }

  public get currentRoomList(): Room[] {
    return this._roomList;
  }

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  public getRooms(): ConnectableObservable<Room[]> {
    return this.http.get<Room[]>('http://' + HOST + '/api/rooms/all').map((roomsJSON: Room[]): Room[] => {
      this._roomList = roomsJSON.map((roomJSON) => new Room(roomJSON));
      return this._roomList;
    }).multicast(this._roomListUpdated);
  }

  public updateCurrentRoom(id: string): ConnectableObservable<Room[]> {
    if (this._roomList === undefined) {
      this.getRooms().subscribe((rooms: Room[]) => {
        console.log(rooms);
        this._roomList = rooms;
        this.currentRoom = this._roomList.find((room) => room.id === id);
      });
    } else {
      this.currentRoom = this._roomList.find((room) => room.id === id);
    }
    return this.getRooms();
  }
}
