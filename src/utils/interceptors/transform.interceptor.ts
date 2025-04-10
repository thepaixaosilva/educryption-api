import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transformResponse(data);
      }),
    );
  }

  private transformResponse(data: any): any {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map((item) => this.transformObject(item));
    }
    return this.transformObject(data);
  }

  private transformObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const transformed = JSON.parse(JSON.stringify(obj));

    if (transformed._doc) {
      transformed._doc = this.processId(transformed._doc);
      return transformed._doc;
    }

    return this.processId(transformed);
  }

  private processId(obj: any): any {
    if (obj._id) {
      if (obj._id.buffer && Array.isArray(obj._id.buffer)) {
        obj.id = Buffer.from(obj._id.buffer).toString('hex');
      } else if (typeof obj._id === 'object' && obj._id !== null) {
        obj.id = obj._id.toString();
      } else {
        obj.id = obj._id;
      }
      delete obj._id;
    }
    return obj;
  }
}
