import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public channel$: BehaviorSubject<string> = new BehaviorSubject('OdsScott');
  public textColor$: BehaviorSubject<string> = new BehaviorSubject('#F0F0FF');
  public fontFamily$: BehaviorSubject<string> = new BehaviorSubject('Poppins');
  public fontSize$: BehaviorSubject<number> = new BehaviorSubject(14);
  public displayBadges$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public displayAnimations$: BehaviorSubject<boolean> = new BehaviorSubject(true);
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

      if (queryParams.has('fontSize')) {
        this.fontSize$.next(parseInt(queryParams.get('fontSize'), 10));
      }

      if (queryParams.has('displayBadges')) {
        this.displayBadges$.next(queryParams.get('displayBadges') === 'true');
      }

      if (queryParams.has('displayAnimations')) {
        this.displayAnimations$.next(queryParams.get('displayAnimations') === 'true');
      }
    });
  }

  sanitize(input: string) {
    return input.replace(/[^\w\s]+/g,'');
  }
}
