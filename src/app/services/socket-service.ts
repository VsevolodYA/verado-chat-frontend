import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  private host: string = 'http://localhost:5000';
  private socket: any;

  constructor() {
    this.socket = io(this.host);
    this.socket.on("connect", () => this.connected());
    this.socket.on("disconnect", () => this.disconnected());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect () {
    this.socket.connect();
  }

  disconnect () {
    this.socket.disconnect();
  }

  emit(chanel, message) {
    return new Observable<any>(observer => {
      console.log(`emit to ${chanel}:`,message);
      this.socket.emit(chanel, message, function (data) {
        if (data.success) {
          observer.next(data);
        } else {
          observer.error(data);
        }
        observer.complete();
      });
    });
  }

  on(event_name) {
    console.log(`listen to ${event_name}:`);
    return new Observable<any>(observer => {
      this.socket.off(event_name);
      this.socket.on(event_name, (data) => {
        observer.next(data);
      });
    });
  }

  private connected() {
    console.log('Connected');
  }

  private disconnected() {
    console.log('Disconnected');
  }
}
