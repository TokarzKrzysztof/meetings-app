import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl = new FormControl();
  @Input() placeholder: IonInput["placeholder"];
  @Input() type: IonInput["type"] = 'text';
  @Input() autocomplete: IonInput["autocomplete"] = 'off';

  constructor() {}

  ngOnInit() {}
}
