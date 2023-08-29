import dayjs from 'dayjs';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export class Validators {
  static maxDate(date: string) {
    if (!dayjs(date).isBefore(dayjs())) {
      return ValidationMessages.maxDate;
    }
  }
}
