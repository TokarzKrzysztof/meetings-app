export enum UserGender {
  Male,
  Female
}

export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  passwordRepeat: string;
  gender: UserGender;
};
