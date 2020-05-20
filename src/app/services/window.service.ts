import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  getProtocol() : string | 'http:' | 'https:' {
    return window.location.protocol || 'https:';
  }
}
