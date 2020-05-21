import { Injectable } from '@angular/core';
import { PlatformLocation, Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(public platformLocation: PlatformLocation, public location: Location) { }

  getProtocol() : string | 'http:' | 'https:' {
    return window.location.protocol || 'https:';
  }

  getUrl(path: string = ''): string {
    return this.location.normalize(window.location.origin + this.platformLocation.getBaseHrefFromDOM()) + path;
  }
}
