import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Room } from '../../shared/models';

const HEADER = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable()
export class RoomService {

  constructor(private http: HttpClient) { }

  public getRoomList(): Room[] {
    return null; // this.http.get<Room[]>();
  }
}
