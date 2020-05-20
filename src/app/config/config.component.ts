import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ChatWidgetOptions from '../interfaces/ChatWidgetOptions';
import { ConfigService } from '../services/config.service';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(private router: Router, public config: ConfigService) { }

  ngOnInit() {
  }

  getWidgetLink() {
    return window.location.origin + this.router.createUrlTree(['/widgets/chat'], { queryParams: this.getOptions() }).toString();
  }

  getOptions(): ChatWidgetOptions {
    return {
      channel: this.config.channel$.value,
      textColor: this.config.textColor$.value,
      fontFamily: this.config.fontFamily$.value,
    }
  }

  copy($event: MouseEvent) {
    const input = <HTMLInputElement>$event.currentTarget;
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('copy');
  }
}
