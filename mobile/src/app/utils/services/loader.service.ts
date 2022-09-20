import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  viewContainerRef!: ViewContainerRef;
  private ref: ComponentRef<LoaderComponent> | null = null;

  constructor() {}

  async show() {
    this.ref = this.viewContainerRef.createComponent(LoaderComponent);
  }

  hide() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }
}
