import { AbstractControl } from '@angular/forms';

export class FormUtils {
  static addError(control: AbstractControl, name: string) {
    control.setErrors({ [name]: true });
  }

  static removeError(control: AbstractControl, name: string) {
    const hasAnotherError = control.errors && !control.errors[name];
    if (!hasAnotherError) {
      control.setErrors(null);
    }
  }
}
