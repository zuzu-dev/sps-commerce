import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception['isAxiosError']) {
      if (exception['config']['url'].startsWith('https://admin.acenda.com/preview/')) {
      }
      const status = exception['status']
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: exception['config']['url'],
          message: exception['message']
        });
    } else {
      super.catch(exception, host);
    }
  }
}