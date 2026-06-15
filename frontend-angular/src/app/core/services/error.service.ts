import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  readonly message = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  getMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiResponse<null> | undefined;

      if (body?.message) {
        return body.message;
      }

      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
      }

      return `Error del servidor (${error.status}).`;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Ocurrió un error inesperado.';
  }

  notify(error: unknown): void {
    this.successMessage.set(null);
    this.message.set(this.getMessage(error));
  }

  setSuccess(message: string): void {
    this.message.set(null);
    this.successMessage.set(message);
  }

  clear(): void {
    this.message.set(null);
    this.successMessage.set(null);
  }
}
