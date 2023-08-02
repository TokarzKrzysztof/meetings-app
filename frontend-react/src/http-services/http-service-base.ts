export class HttpServiceBase {
  protected static apiUrl = 'https://localhost:7175/api';

  static get<T>(url: string) {
    return fetch(url).then((res) => res.json() as Promise<T>);
  }
}
