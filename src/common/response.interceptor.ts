import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interceptor to standardize successful API responses.
@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  constructor(@Inject('LOGGER') private readonly logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const responseObj = ctx.getResponse();
    const traceId = request.headers['x-trace-id'] || undefined;
    const statusCode = responseObj.statusCode;


    return next.handle().pipe(
      map((data) => {
        const response = {
          code: 'SUCCESS',
          message: 'OK',
          details: null,
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          traceId,
          data,
        };
        this.logger.info({ response });
        return response;
      }),
    );
  }
}