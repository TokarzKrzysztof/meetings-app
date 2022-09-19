import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
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
import { FormUtils } from '../../../utils/form-utils';

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
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
    passwordRepeat: new FormControl<string | null>(null, [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    gender: new FormControl<UserGender>(UserGender.Male, [Validators.required]),
  });

  errorMsg: string | null = null;

  constructor(private nav: NavController, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const { password, passwordRepeat } = this.formGroup.controls;
        const isValid = password.value === passwordRepeat.value;
        if (isValid) {
          FormUtils.removeError(password, 'passwordsNotMatch');
          FormUtils.removeError(passwordRepeat, 'passwordsNotMatch');
          this.errorMsg = null;
        } else {
          FormUtils.addError(password, 'passwordsNotMatch');
          FormUtils.addError(passwordRepeat, 'passwordsNotMatch');
          this.errorMsg = 'Hasła są różne';
        }
      });
  }

  handleGoToLogin() {
    this.nav.navigateForward(AppRoutes.Login);
  }

  onSubmit() {
    if (this.formGroup.invalid) return;
    this.authService.login(
      this.formGroup.value as { email: string; password: string }
    );
  }
}
