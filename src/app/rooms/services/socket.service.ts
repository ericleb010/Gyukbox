import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Action } from '../../shared/models/socketEvents';

const HOST = `${environment.apiHost}:${environment.apiPort}`;

@Injectable()
export class SocketService {
  private socket;

  constructor() { }

  initSocket(): void {
    this.socket = socketIo(HOST);
  }

  send(action: string, message: any): void {
    this.socket.emit(action, message);
  }

  onAction(action: Action): Observable<any> {
    return new Observable<Action>(observer => {
      console.log(action);
      this.socket.on(action, (data: any) => observer.next(data));
    });
  }

  onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
