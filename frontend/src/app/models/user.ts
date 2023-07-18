export enum UserGender {
    Male,
    Female
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: UserGender;
}