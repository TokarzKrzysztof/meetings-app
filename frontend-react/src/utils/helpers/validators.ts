import dayjs from 'dayjs';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export class Validators {
  static readonly maxStringLength = {
    value: 255,
    message: ValidationMessages.maxLength(255),
  } as const;

  static maxDate(date: string) {
    if (!dayjs(date).isBefore(dayjs())) {
      return ValidationMessages.maxDate;
    }
  }
}
