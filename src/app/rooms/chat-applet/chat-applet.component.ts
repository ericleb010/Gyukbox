import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { Action } from '../../shared/models/socketEvents';
import { SocketService } from '../services/socket.service';
import { ChatMessage } from '../../shared/models/chat';
import { RoomService } from '../../shared/services/room.service';

@Component({
  selector: 'gyukbox-chat-applet',
  templateUrl: './chat-applet.component.html',
  styleUrls: ['./chat-applet.component.scss']
})
export class ChatAppletComponent implements OnInit {

  private chatList: ChatMessage[];
  private CHAR_LIMIT = 240;
  private currentChatMessage = '';

  constructor(
    private socketService: SocketService,
    private roomService: RoomService,
  ) { }

  public addChatMessage() {
    console.log(this.currentChatMessage);
    const truncatedMessage = this.currentChatMessage.substr(0, this.CHAR_LIMIT);

    const finalMessage: ChatMessage = new ChatMessage(<ChatMessage> {
      userName: 'Default User',
      message: truncatedMessage,
      time: moment().format('h:mm'),
    });

    this.socketService.send(Action.ADD_CHAT_MESSAGE, finalMessage);
  }

  ngOnInit() {
    // this.roomService.roomListUpdated.subscribe(() => {
    //   this.socketService.onAction(Action.CHAT_LIST).subscribe((msgs: ChatMessage[]) => {
    //     this.chatList = msgs.map<ChatMessage>((msgJSON): ChatMessage => {
    //       return new ChatMessage(msgJSON);
    //     });
    //   });
    // });
  }

}
