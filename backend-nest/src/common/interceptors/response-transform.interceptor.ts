import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../responses/api-response';

function isStandardizedResponse(value: unknown): value is ApiResponse {
  if (value instanceof ApiResponse) {
    return true;
  }

  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.success === 'boolean' &&
    typeof response.message === 'string'
  );
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (isStandardizedResponse(data)) {
          return data;
        }

        return ApiResponse.success(data);
      }),
    );
  }
}
