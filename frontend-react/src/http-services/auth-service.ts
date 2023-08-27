import { HttpServiceBase } from 'src/http-services/http-service-base';
import { LoginCredentials } from 'src/models/login-credentials';

export class AuthService extends HttpServiceBase {
  static login(data: LoginCredentials) {
    return this.post<string>(`${this.apiUrl}/Auth/Login`, data);
  }
}
