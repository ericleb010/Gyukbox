import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  const HEADER = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { 
    
  }

  public getRoomList(): Room[] {
    
  }
}
