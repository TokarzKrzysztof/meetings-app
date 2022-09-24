import { TestBed } from '@angular/core/testing';

import { NativeInterceptor } from './native.interceptor';

describe('NativeInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NativeInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NativeInterceptor = TestBed.inject(NativeInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
