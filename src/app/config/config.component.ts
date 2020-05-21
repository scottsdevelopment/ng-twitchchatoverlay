import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ChatWidgetOptions from '../interfaces/ChatWidgetOptions';
import { ConfigService } from '../services/config.service';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(private router: Router, public config: ConfigService, private window: WindowService) { }

  ngOnInit(): void {
  }

  getWidgetLink(): string {
    return this.window.getUrl(this.router.createUrlTree(['', 'widgets', 'chat'], { queryParams: this.getOptions() }).toString());
  }

  getOptions(): ChatWidgetOptions {
    return {
      channel: this.config.channel$.value,
      textColor: this.config.textColor$.value,
      fontFamily: this.config.fontFamily$.value,
      fontSize: this.config.fontSize$.value,
      displayBadges: this.config.displayBadges$.value ? 'true' : 'false',
      displayAnimations: this.config.displayAnimations$.value ? 'true' : 'false',
    }
  }

  copy($event: MouseEvent): void {
    const input = <HTMLInputElement>$event.currentTarget;
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('copy');
  }

  parseInt(s: string, radix?: number) {
    return parseInt(s, radix)
  }
}
