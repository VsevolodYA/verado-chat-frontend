import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../services/socket-service";
import {Router} from "@angular/router";
import {ChatService} from "../../services/chat-service";

@Component({
  selector: 'start-page',
  templateUrl: './start-page.html'
})

export class StartPage {

  enterForm: any = {name: null, type: null, token: null};

  constructor(private socket: SocketService,
              private router: Router,
              private chatService: ChatService) {

  }

  connect() {

    if(! this.enterForm.name || ! this.enterForm.type) {
      return;
    }

    if(this.enterForm.token.length !== 40) {
      return;
    }

    if(this.enterForm.type === 'SELLER') {
      this.createChannel();
    } else if (this.enterForm.type === 'BUYER') {
      this.connectToChannel();
    }

  }

  private createChannel() {

    this.socket.emit('CHAT_CREATE', this.enterForm).subscribe(
      (data) => {
        console.log('Success', data);
        localStorage.setItem('token', this.enterForm.token);
        localStorage.setItem('name', this.enterForm.name);
        this.chatService.chatData = data.body.chatData;
        this.router.navigate(['/chat']);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      });
  }

  private connectToChannel() {
    this.socket.emit('CONNECT_TO_CHAT', this.enterForm).subscribe(
      (data) => {
        console.log('Success', data);
        localStorage.setItem('token', this.enterForm.token);
        localStorage.setItem('name', this.enterForm.name);
        this.chatService.chatData = data.body.chatData;
        this.router.navigate(['/chat']);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      });
  }

  generateToken() {
    this.enterForm.token = this.chatService.generateToken();
  }
}
