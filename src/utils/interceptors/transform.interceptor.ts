import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transformResponse(data)
      })
    )
  }

  private transformResponse(data: any): any {
    if (!data) return data

    if (Array.isArray(data)) {
      return data.map((item) => this.transformObject(item))
    }

    return this.transformObject(data)
  }

  private transformObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj

    const transformed = { ...obj }

    if (transformed._id) {
      if (typeof transformed._id === 'object' && transformed._id !== null && transformed._id.toString) {
        transformed.id = transformed._id.toString()
      } else {
        transformed.id = transformed._id
      }

      delete transformed._id
    }

    return transformed
  }
}
