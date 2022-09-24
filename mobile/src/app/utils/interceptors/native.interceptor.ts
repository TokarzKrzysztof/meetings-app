import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { PlatformService } from '../services/platform.service';

type HttpMethod = Parameters<HTTP['sendRequest']>[1]['method'];

@Injectable()
export class NativeInterceptor implements HttpInterceptor {
  constructor(private httpNative: HTTP, private platform: PlatformService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.platform.is('browser')) {
      return next.handle(req);
    }

    return from(this.handleNativeRequest(req));
  }

  private async handleNativeRequest(request: HttpRequest<any>): Promise<HttpResponse<any>> {
    await this.platform.ready();

    const headerKeys = request.headers.keys();
    const headers: Record<string, any> = {};

    headerKeys.forEach((key: string) => {
      headers[key] = request.headers.get(key);
    });

    try {
      const nativeHttpResponse = await this.httpNative.sendRequest(request.url, {
        method: request.method.toLowerCase() as HttpMethod,
        data: request.body,
        headers: headers,
        serializer: 'json',
      });

      let body;
      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = { response: nativeHttpResponse.data };
      }

      const response = new HttpResponse({
        body: body,
        status: nativeHttpResponse.status,
        headers: new HttpHeaders(nativeHttpResponse.headers),
        url: nativeHttpResponse.url,
      });

      return Promise.resolve(response);
    } catch (error: any) {
      if (!error.status) {
        return Promise.reject(error);
      }

      const response = new HttpErrorResponse({
        error: error,
        status: error.status,
        headers: new HttpHeaders(error.headers),
        url: error.url,
      });

      return Promise.reject(response);
    }
  }
}
