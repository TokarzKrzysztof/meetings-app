export class ValidationMessages {
  static readonly required = 'Pole jest wymagane';
  static readonly email = 'Wpisz poprawny adres e-mail';
  static readonly passwordsNotMatch = 'Hasła nie są zgodne';
  static readonly maxDate = 'Data nie może być przyszła';
  static readonly maxLength = (length: number) => `Maksymalna długość to ${length} znaków`;
}
