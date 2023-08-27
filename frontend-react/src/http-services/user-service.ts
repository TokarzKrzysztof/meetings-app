import { HttpServiceBase } from 'src/http-services/http-service-base';
import { User } from 'src/models/user';

export class UserService extends HttpServiceBase {
  static register(data: User) {
    return this.post<undefined>(`${this.apiUrl}/User/Register`, data);
  }
}
