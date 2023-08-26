import axios from 'axios';

export class HttpServiceBase {
  protected static apiUrl = 'https://localhost:7175/api';

  static get<T>(url: string) {
    return axios.get(url).then((res) => res.data as Promise<T>);
  }

  static post<T>(url: string, body?: any) {
    return axios.post(url, body).then((res) => res.data as Promise<T>);
  }
}
