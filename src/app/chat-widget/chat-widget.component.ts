import { Component, ViewChild, ElementRef, IterableDiffers, IterableDiffer, Input } from '@angular/core';
import { TwitchChatService } from '../services/twitch-chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter, concatMap, takeLast, map, debounce } from 'rxjs/operators';
import { TmiMessage } from '../interfaces/TmiMessage';
import { WindowService } from '../services/window.service';
import ChatMessage from '../interfaces/ChatMessage';
import { trigger, state, style, animate, transition } from '@angular/animations';
import ChatWidgetOptions from '../interfaces/ChatWidgetOptions';
import { ConfigService } from '../services/config.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ChatWidgetComponent {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @Input() options: ChatWidgetOptions;
  messages: Array<ChatMessage> = [];
  messageLength = 50;

  constructor(public tmi: TwitchChatService, public window: WindowService, private route: ActivatedRoute, public config: ConfigService) {
    tmi.connected$
      .pipe(
        filter(value => value === true),
        concatMap((value, index) => this.config.channel$.pipe(debounce(() => timer(1000))))
      )
      .subscribe(channel => {
        tmi.joinChannel(channel)
      });

    tmi.messages$
      .subscribe((messageEvent: TmiMessage) => {
        if (this.messages.length >= this.messageLength) {
          this.messages.shift();
        }
        this.messages.push({
          badges: messageEvent.userstate.badges,
          color: messageEvent.userstate.color || this.tmi.getColorForName(messageEvent.userstate.username),
          username: messageEvent.userstate['display-name'],
          messageParts: tmi.getMessageParts(messageEvent)
        });
      });

    this.config.debug$.subscribe(() => this.debug());
    this.config.fontFamily$.pipe(debounce(() => timer(1000))).subscribe((font) => this.window.loadFont(font));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight
  }

  debug() {
    for (let i = 0; i < 51; i++) {
      setTimeout(() => this.messages.push({
        badges: {
          broadcaster: (Math.random() * 100 > 50) ? '1' : null
        },
        color: '#000000',
        username: 'test' + i,
        messageParts: ['lorem ipsum, lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum', { image: '44' }]
      }), 100 * i);
    }
  };

}