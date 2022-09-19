import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { AppRoutes } from '../../../utils/enums/app-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(private nav: NavController, private authService: AuthService) {}

  ngOnInit() {}

  handleGoToRegister() {
    this.nav.navigateForward(AppRoutes.Register);
  }

  onSubmit() {
    if (this.formGroup.invalid) return;
    this.authService.login(
      this.formGroup.value as { email: string; password: string }
    );
  }
}
