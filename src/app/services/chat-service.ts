import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
  chatData: object;

  generateToken() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 40; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
