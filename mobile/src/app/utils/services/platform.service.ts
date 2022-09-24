import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(private platform: Platform) {}

  ready() {
    return this.platform.ready();
  }

  is(platform: 'mobile' | 'browser') {
    if (platform === 'mobile') {
      return this.platform.is('android') || this.platform.is('ios');
    } else {
      return this.platform.is('desktop') || this.platform.is('mobileweb');
    }
  }
}
