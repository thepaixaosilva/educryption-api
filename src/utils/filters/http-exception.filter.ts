import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    const isProduction = process.env.NODE_ENV === 'production'
    const requestId = randomUUID()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'An error occurred'
    let errors: Array<{ field: string; message: string }> = []

    try {
      if (exception instanceof HttpException) {
        status = exception.getStatus()
        const exceptionResponse = exception.getResponse() as any

        if (isProduction) {
          if (status === HttpStatus.CONFLICT) {
            message = 'Validation error'
            errors =
              exceptionResponse.violations?.map((v: any) => ({
                field: v.field,
                message: 'Invalid value',
              })) || []
          } else {
            message = 'An error occurred'
          }
        } else {
          message = exceptionResponse.message
          errors = exceptionResponse.violations || []
        }
      }

      // Real error log (internally only)
      this.logger.error({
        response: (exception as HttpException).getResponse() || '',
        path: request.path,
        method: request.method,
        userId: request.user?.id,
        requestId,
      })

      response.status(status).json({
        statusCode: status,
        message,
        errors,
        requestId, // para tracking
        timestamp: new Date().toISOString(),
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Failsafe - never expose internal errors
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        requestId,
      })
    }
  }
}
