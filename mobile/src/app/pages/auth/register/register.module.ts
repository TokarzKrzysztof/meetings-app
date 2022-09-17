import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { HeaderComponent } from '../../../components/header/header.component';
import { UIModule } from '../../../components/UI/ui.module';
import { AuthButtonComponent } from '../../../components/auth-button/auth-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    UIModule,
    AuthButtonComponent,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
