import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class StoreExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (error instanceof HttpException) return response.status(error.getStatus()).json(error.getStatus() >= 500 ? { message: 'Error interno del servidor' } : error.getResponse());
    const status = Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599 ? error.status : 500;
    return response.status(status).json(status >= 500 ? { message: 'Error interno del servidor' } : { message: error?.message || 'Solicitud inválida', ...(error?.details ? { details: error.details } : {}) });
  }
}
