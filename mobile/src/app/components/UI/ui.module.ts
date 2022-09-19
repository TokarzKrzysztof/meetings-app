import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    RadioGroupComponent,
    ErrorMessageComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [
    InputComponent,
    ButtonComponent,
    RadioGroupComponent,
    ErrorMessageComponent,
  ],
})
export class UIModule {}
