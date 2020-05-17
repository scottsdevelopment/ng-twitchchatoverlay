import { Component, ViewChild, ElementRef } from '@angular/core';
import { TwitchChatService } from './twitch-chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter, concatMap, takeLast, map } from 'rxjs/operators';
import { TmiMessage } from './interfaces/TmiMessage';
import { Badges } from 'tmi.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

  messageList: {
    badges?: Badges,
    style: { [key: string]: any },
    username: string,
    messageParts: Array<(string | { image: string })>
  }[] = [];

  messageLength = 50;

  constructor(public tmi: TwitchChatService, private route: ActivatedRoute) {
    tmi.connected$
      .pipe(
        filter(value => value === true),
        concatMap((value, index) => route.queryParamMap.pipe(filter((query) => query.has('channel'))))
      )
      .subscribe(query => {
        tmi.joinChannel(query.get('channel'))
      });

    tmi.messages$
      .subscribe((messageEvent: TmiMessage) => {
        if (this.messageList.length >= this.messageLength) {
          this.messageList.shift();
        }
        this.messageList.push({
          badges: messageEvent.userstate.badges,
          style: tmi.getStyle(messageEvent),
          username: messageEvent.userstate['display-name'],
          messageParts: tmi.getMessageParts(messageEvent)
        });
        setTimeout(() => this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight);
      });
  }

  getProtocol() {
    return window.location.protocol;
  }
}