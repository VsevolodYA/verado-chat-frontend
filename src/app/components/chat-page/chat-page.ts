import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../../services/socket-service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {ChatService} from "../../services/chat-service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'chat-page',
  templateUrl: './chat-page.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)',
        left: 'calc(50% - 125px)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('appear', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('400ms ease-in-out')),
      transition('hide => show', animate('400ms ease-in-out'))
    ]),
  ]
})

export class ChatPage {

  currentName: string;
  messageToPost: string;
  chatData: any;
  messages: Array<any> = [];
  token: string = null;

  price: number;
  amount: number;

  incomingOffer: {
    price: number,
    amount: number,
    message_id: number
  };

  constructor(private socket: SocketService,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private chatService: ChatService) {

  }

  ngOnInit() {

    this.token = localStorage.getItem('token');
    this.currentName = localStorage.getItem('name');
    this.chatData = this.chatService.chatData;

    if (! this.token || ! this.currentName || ! this.chatData) {
      this.router.navigate(['/connect'])
    }

    this.incomingOffer = {
      price: null,
      amount: null,
      message_id: null
    };

    this.socket.on('POST_MESSAGE_SERVER').subscribe(
      (data) => {

        console.log('Success', data);

        this.messages.push(data.body.message);

        if(data.body.message.offer && data.body.message.senderName !== this.currentName) {
          this.incomingOffer = {
            price: data.body.message.offer.price,
            amount: data.body.message.offer.amount,
            message_id: data.body.message.id
          };

          this.toggleIncomingOfferModal();

        }

        this.scrollToBottom();
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      });

    this.socket.on('SEND_OFFER_RESPONSE_SERVER').subscribe(
      (data) => {
        let offerMessageIndex = this.messages.findIndex(message => message.id === data.body.message.id);
        setTimeout(() => { this.messages[offerMessageIndex] = data.body.message}, 500);
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      }
    );
  }

  postMessage() {

    let data: any = {
      text: this.messageToPost,
      token: this.token
    };

    if(this.offerModalSlide == 'in' && this.price && this.amount) {

      data.offer = {
        price: this.price,
        amount: this.amount
      };

      this.toggleOfferModal();

    } else if(this.offerModalSlide == 'in' && (! this.price || ! this.amount)) {
      return;
    }

    this.socket.emit("POST_MESSAGE_CLIENT", data).subscribe(
      (data) => {
        console.log('Success', data);
        this.messageToPost = '';
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      });
  }

  sendOfferResponse(status) {

    this.socket.emit('SEND_OFFER_RESPONSE_CLIENT',
      {status: status, token: this.token, message_id: this.incomingOffer.message_id})
      .subscribe(
      (data) => {
        console.log('Success', data);

        this.incomingOffer = {
          price: null,
          amount: null,
          message_id: null
        };

        this.toggleIncomingOfferModal();
      },
      (error) => {
        console.log('Error', error);
      },
      () => {
        console.log('complete');
      });
  }

  offerModalSlide: string = 'out';

  toggleOfferModal() {
    this.offerModalSlide = (this.offerModalSlide === 'out' ? 'in' : 'out');
  }

  incomingOfferAppear: string = 'hide';

  toggleIncomingOfferModal() {
    this.incomingOfferAppear = (this.incomingOfferAppear === 'hide' ? 'show' : 'hide');
  }

  @ViewChild('scrollBottom') private chatBlock: ElementRef;
  scrollToBottom(): void {
    try {
      this.chatBlock.nativeElement.scrollTop = this.chatBlock.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err);
    }
  }
}
