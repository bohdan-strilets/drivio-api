import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { getCodeFromExceptionResponse } from './http-exception-filter.utils';
import { ErrorResponse } from './types/http-exception-filter.types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const code =
      getCodeFromExceptionResponse(exceptionResponse) ?? HttpStatus[statusCode];

    const errorResponse: ErrorResponse = {
      statusCode,
      code,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`${request.method} ${request.url} ${statusCode} ${code}`);

    response.status(statusCode).json(errorResponse);
  }
}
