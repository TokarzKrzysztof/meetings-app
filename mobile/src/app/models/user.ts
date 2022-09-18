export enum UserGender {
    Male,
    Female
}

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: UserGender;
}