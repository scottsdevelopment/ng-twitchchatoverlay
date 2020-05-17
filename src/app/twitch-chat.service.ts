import { Injectable } from '@angular/core';
import * as tmi from 'tmi.js';
import { BehaviorSubject, Subject } from 'rxjs';
import { TmiMessage } from './interfaces/TmiMessage';

@Injectable({
  providedIn: 'root'
})
export class TwitchChatService {

  public messages$: Subject<TmiMessage> = new Subject();
  public connected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public client: tmi.Client = tmi.Client({
    connection: {
      secure: window.location.protocol === 'https:'
    }
  });

  defaultColors = [
    ['Red', '#FF0000'],
    ['Blue', '#0000FF'],
    ['Green', '#00FF00'],
    ['FireBrick', '#B22222'],
    ['Coral', '#FF7F50'],
    ['YellowGreen', '#9ACD32'],
    ['OrangeRed', '#FF4500'],
    ['SeaGreen', '#2E8B57'],
    ['GoldenRod', '#DAA520'],
    ['Chocolate', '#D2691E'],
    ['CadetBlue', '#5F9EA0'],
    ['DodgerBlue', '#1E90FF'],
    ['HotPink', '#FF69B4'],
    ['BlueViolet', '#8A2BE2'],
    ['SpringGreen', '#00FF7F']
  ];

  constructor() {
    this.client.connect();
    this.client.on('connected', (_, __) => this.connected$.next(true));
    this.client.on('message', this.onMessage.bind(this));
  }

  joinChannel(channel: string) {
    const channels = channel.split(',');
    channels.forEach(channel => this.client.join(channel));
  }

  onMessage(channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean): void {
    this.messages$.next({ channel, userstate, message, self });
  }

  getStyle(event: TmiMessage): { [key: string]: any; } {
    const styles = {};
    if (event.userstate.color) {
      styles['color'] = event.userstate.color;
    } else {
      styles['color'] = this.getColorForName(event.userstate.username);
    }

    return styles;
  }

  getColorForName( username: string ) {
    const i = username.charCodeAt(0) + username.charCodeAt(username.length - 1);
    return this.defaultColors[i % this.defaultColors.length][1];
  }

  getMessageParts( event: TmiMessage ): Array<(string | { image: string })> {
    const parts: Array<(string | { image: string })> = [];
    const emojis: Array<[string, number[]]> = [];
    const pairs = Object.entries(event.userstate.emotes || {})
   
    for (let i = 0; i < pairs.length; i++) {
      const [ key, values ] = pairs[i];
      for(let y = 0; y < values.length; y++) {
        emojis.push([key, values[y].split('-').map(n => parseInt(n, 10))])
      }
    }

    emojis.sort((a, b) => a[1][0] - b[1][0]);

    let n = 0;

    for(let i = 0; i < emojis.length; i++) {
      const [key, [start, end]] = emojis[i];
      const message = event.message.slice(n, start);
      if (message !== '') {
        parts.push(message);
      }
      parts.push({image: key});
      n = end + 1;
    }

    parts.push(event.message.slice(n));
  
    return parts;
  }

}
