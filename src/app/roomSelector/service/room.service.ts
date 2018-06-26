import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models';

const HEADER = new HttpHeaders().set('Content-Type', 'application/json');
const HOST = `${environment.apiHost}:${environment.apiPort}`;

@Injectable()
export class RoomService {

  constructor(private http: HttpClient) { }

  public getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(HOST + '/rooms').map((rooms: Room[]): Room[] => {
      return rooms.map((room) => new Room(room));
    });
  }
}
