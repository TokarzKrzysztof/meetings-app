export enum UserGender {
  Male,
  Female
}

export type User = {
  id: string;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  birthDate: string;
  passwordRepeat: string | null;
  gender: UserGender;
  profileImage: string | null;
};
