import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface RadioOption<T = any> {
  value: T;
  text: string;
}

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent implements OnInit {
  @Input() control: FormControl = new FormControl();
  @Input() title: string;
  @Input() options: RadioOption[] = [];

  constructor() { }

  ngOnInit() {}

}
