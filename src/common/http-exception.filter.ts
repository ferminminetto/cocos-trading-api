import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject('LOGGER') private readonly logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const traceId = request.headers['x-trace-id'] || undefined;

    const errorResponse = {
      code: exception.code || 'ERROR',
      message: exception.message || 'Internal server error',
      details: exception.details || null,
      traceId,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(errorResponse);

    response.status(status).json(errorResponse);
  }
}