import { GlobalHttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, NotFoundException, HttpStatus } from '@nestjs/common';

describe('GlobalHttpExceptionFilter (unit)', () => {
  function createHost(opts: {
    headers?: Record<string,string>;
    url?: string;
  }, cb: (status: number, body: any) => void): ArgumentsHost {
    const res = {
      status: jest.fn().mockImplementation((code: number) => ({
        json: (payload: any) => cb(code, payload),
      })),
    };
    const req = {
      url: opts.url || '/test',
      headers: opts.headers || {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any;
  }

  const logger = {
    error: jest.fn(),
  };

  it('formats HttpException (e.g. NotFound)', () => {
    const filter = new GlobalHttpExceptionFilter(logger as any);
    const ex = new NotFoundException('Not here');
    let captured: any;
    const host = createHost({}, (code, body) => (captured = { code, body }));
    filter.catch(ex, host);

    expect(captured.code).toBe(HttpStatus.NOT_FOUND);
    expect(captured.body.message).toBe('Not here');
    expect(captured.body.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(logger.error).toHaveBeenCalled();
  });

  it('handles generic errors and propagates x-trace-id', () => {
    const filter = new GlobalHttpExceptionFilter(logger as any);
    const ex = new Error('Boom');
    let captured: any;
    const host = createHost({ headers: { 'x-trace-id': 'abc-123' } }, (code, body) => (captured = { code, body }));
    filter.catch(ex as any, host);

    expect(captured.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(captured.body.code).toBe('ERROR');
    expect(captured.body.message).toBe('Boom');
    expect(captured.body.traceId).toBe('abc-123');
  });
});