import { Component, ViewContainerRef } from '@angular/core';
import { LoaderService } from './utils/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(viewContainerRef: ViewContainerRef, loader: LoaderService) {
    loader.viewContainerRef = viewContainerRef;
  }
}
