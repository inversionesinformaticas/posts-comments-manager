import { Component, inject } from '@angular/core';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  template: `
    @if (errorService.successMessage(); as successMessage) {
      <div class="alert alert-success app-alert alert-dismissible fade show mb-4" role="alert">
        {{ successMessage }}
        <button
          type="button"
          class="btn-close"
          aria-label="Cerrar"
          (click)="errorService.clear()"
        ></button>
      </div>
    }

    @if (errorService.message(); as message) {
      <div class="alert alert-danger app-alert alert-dismissible fade show mb-4" role="alert">
        {{ message }}
        <button
          type="button"
          class="btn-close"
          aria-label="Cerrar"
          (click)="errorService.clear()"
        ></button>
      </div>
    }
  `,
})
export class AlertMessageComponent {
  readonly errorService = inject(ErrorService);
}
