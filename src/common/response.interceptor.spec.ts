import { GlobalResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('GlobalResponseInterceptor (unit)', () => {
  function createContext(headers: Record<string,string> = {}, url = '/resource'): ExecutionContext {
    const res = { statusCode: 200 };
    const req = { headers, url };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any;
  }

  const logger = { info: jest.fn() };

  it('envelops the response in a standard format', (done) => {
    const interceptor = new GlobalResponseInterceptor(logger as any);
    const ctx = createContext({ 'x-trace-id': 'trace-1' }, '/hello');
    const handler: CallHandler = { handle: () => of({ hello: 'world' }) };

    interceptor.intercept(ctx, handler).subscribe((wrapped) => {
      expect(wrapped.code).toBe('SUCCESS');
      expect(wrapped.message).toBe('OK');
      expect(wrapped.statusCode).toBe(200);
      expect(wrapped.path).toBe('/hello');
      expect(wrapped.traceId).toBe('trace-1');
      expect(wrapped.data).toEqual({ hello: 'world' });
      expect(logger.info).toHaveBeenCalled();
      done();
    });
  });

  it('omits traceId when not present in headers', (done) => {
    const interceptor = new GlobalResponseInterceptor(logger as any);
    const ctx = createContext({}, '/no-trace');
    const handler: CallHandler = { handle: () => of({ ok: true }) };

    interceptor.intercept(ctx, handler).subscribe((wrapped) => {
      expect(wrapped.traceId).toBeUndefined();
      done();
    });
  });
});