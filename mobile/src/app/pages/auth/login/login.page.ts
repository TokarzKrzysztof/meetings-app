import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppRoutes } from '../../../utils/enums/app-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl<string>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string>(null, [Validators.required]),
  });

  constructor(private nav: NavController) {}

  ngOnInit() {}

  handleGoToRegister() {
    this.nav.navigateForward(AppRoutes.Register);
  }

  handleLogin() {
    if (this.formGroup.invalid) return;
  }
}
