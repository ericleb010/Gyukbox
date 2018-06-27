import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

const HOST = `${environment.apiHost}:${environment.apiPort}`;

@Injectable()
export class SocketService {
  private socket;

  constructor() { }

  initSocket(): void {
    this.socket = socketIo(HOST);
  }

  public send(action: string, message: any): void {
    this.socket.emit(action, message);
  }

  onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
