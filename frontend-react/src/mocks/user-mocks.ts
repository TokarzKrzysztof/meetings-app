import { User, UserGender } from 'src/models/user';

export class UserMocks {
  static Register: Partial<User> = {
    email: 'krzysiek210796@gmail.com',
    password: '12345',
    passwordRepeat: '12345',
    locationId: 'a0856f67-070d-465a-8849-73bef57c99b1',
    firstName: 'Krzysiek',
    lastName: 'TokarzTest',
    gender: UserGender.Male,
    birthDate: new Date().toISOString(),
  };
}
