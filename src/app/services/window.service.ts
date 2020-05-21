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
  
  loadFont(font: string, id: string = 'windowFont'): void {
    const existingFont = document.getElementById(id)
    if (existingFont) {
      existingFont.remove();
    }
    const style = document.createElement('style');
    style.id = id;
    style.innerText = `@import url('https://fonts.googleapis.com/css2?family=${font}:wght@300&display=swap'); app-chat-widget { font-family: ${font} }`;
    document.body.appendChild(style);
  }
}
