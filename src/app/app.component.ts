import { Component, ViewChild, ElementRef } from '@angular/core';
import { TwitchChatService } from './twitch-chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

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
      .subscribe(() => {
        setTimeout(() => this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight);
      });
  }
}