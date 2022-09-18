import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { RadioOption } from '../../../components/UI/radio-group/radio-group.component';
import { UserGender } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { AppRoutes } from '../../../utils/enums/app-routes';
import { takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../../utils/destroyable';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends Destroyable implements OnInit {
  readonly genderOptions: RadioOption[] = [
    { text: 'Mężczyzna', value: UserGender.Male },
    { text: 'Kobieta', value: UserGender.Female },
  ];

  formGroup = new FormGroup({
    email: new FormControl<string>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string>(null, [Validators.required]),
    passwordRepeat: new FormControl<string>(null, [Validators.required]),
    firstName: new FormControl<string>(null, [Validators.required]),
    lastName: new FormControl<string>(null, [Validators.required]),
    gender: new FormControl<UserGender>(UserGender.Male, [Validators.required]),
  });

  constructor(private nav: NavController, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(({ password, passwordRepeat }) => {
      const error =
        password !== passwordRepeat ? { passwordsNotMatch: true } : null;
      this.formGroup.controls.password.setErrors(error);
      this.formGroup.controls.passwordRepeat.setErrors(error);

      this.formGroup.updateValueAndValidity({ emitEvent: false });
    });
  }

  handleGoToLogin() {
    this.nav.navigateForward(AppRoutes.Login);
  }

  onSubmit() {
    console.log(this.formGroup.valid);
    if (this.formGroup.invalid) return;
    this.authService.login(
      this.formGroup.value as { email: string; password: string }
    );
  }
}
