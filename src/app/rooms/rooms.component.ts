import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'gyukbox-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
  videoId: string;
  videoAdded: Subject<string> = new Subject<string>();
  
  constructor() { }

  addVideo() {
    this.videoAdded.next(this.videoId);
  }
}
