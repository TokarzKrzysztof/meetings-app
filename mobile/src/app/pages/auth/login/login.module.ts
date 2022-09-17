import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { HeaderComponent } from '../../../components/header/header.component';
import { UIModule } from '../../../components/UI/ui.module';
import { AuthButtonComponent } from '../../../components/auth-button/auth-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    HeaderComponent,
    UIModule,
    AuthButtonComponent
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
