import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() variant: 'text' = 'text';
  @Input() type: IonButton['type'] = 'button';

  btnParams: Partial<IonButton> = {};

  ngOnInit() {}

  ngOnChanges(): void {
    if (this.variant === 'text') {
      this.btnParams = {
        fill: 'clear',
      };
    }
  }
}
