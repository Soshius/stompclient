import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

interface Message {
  text: string;
  user: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl = '/socket';
  private title = 'WebSockets chat';
  private stompClient;
  userName: string;
  messageText: string;
  messages: Array<Message>;
  constructor() {
    this.messages = [];
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.debug('test');
      that.stompClient.subscribe('/chat', (message) => {
        if (message.body) {
          // do something with the message
          const messageToPush: Message = {
            user: JSON.parse(message.body).user,
            text: JSON.parse(message.body).text,
          };
          that.messages.push(messageToPush);
        }
      });
    });
  }

  sendMessage(user: string, text: string) {
    console.log(user + ' -> ' + text);
    const messageToPush: Message = {
      user: user,
      text: text,
    };
    this.stompClient.send('/app/send/message' , {}, JSON.stringify(messageToPush));
  }
}
