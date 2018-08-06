import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StartPage } from "./components/start-page/start-page";
import { SocketService } from "./services/socket-service";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChatPage } from "./components/chat-page/chat-page";
import {ChatService} from "./services/chat-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatCard,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    StartPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/connect', pathMatch: 'full',
      },
      {
        path: 'connect',
        component: StartPage
      },
      {
        path: 'chat',
        component: ChatPage
      }
    ]),
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  exports: [RouterModule],
  providers: [
    SocketService,
    ChatService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
