import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { debounce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public channel$: BehaviorSubject<string> = new BehaviorSubject('OdsScott');
  public textColor$: BehaviorSubject<string> = new BehaviorSubject('#F0F0FF');
  public fontFamily$: BehaviorSubject<string> = new BehaviorSubject('Poppins');
  public debug$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.has('channel')) {
        this.channel$.next(this.sanitize(queryParams.get('channel')));
      }

      if (queryParams.has('textColor')) {
        this.textColor$.next(`#${this.sanitize(queryParams.get('textColor'))}`);
      }

      if (queryParams.has('fontFamily')) {
        this.fontFamily$.next(this.sanitize(queryParams.get('fontFamily')));
      }
    });

    this.fontFamily$.pipe(debounce(() => timer(1000))).subscribe((font) => this.loadFont(font));
  }

  sanitize(input: string) {
    return input.replace(/[^\w\s]+/g,'');
  }

  loadFont(font: string): void {
    const existingFont = document.getElementById('configFont')
    if (existingFont) {
      existingFont.remove();
    }
    const style = document.createElement('style');
    style.id = 'configFont';
    style.innerText = `@import url('https://fonts.googleapis.com/css2?family=${font}:wght@300&display=swap'); app-chat-widget { font-family: ${font} }`;
    document.body.appendChild(style);
  }
}
