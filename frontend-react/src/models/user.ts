import { UserLocation } from "src/models/user-location";

export enum UserGender {
  Male,
  Female,
}
export enum UserActiveStatus {
  Online,
  RecentlyOnline,
  Offline,
}

export type User = {
  id: string;
  isDelete: boolean;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  birthDate: string;
  passwordRepeat: string | null;
  gender: UserGender;
  profileImageSrc: string | null;
  activeStatus: UserActiveStatus;
  locationId: UserLocation['id'];
};
