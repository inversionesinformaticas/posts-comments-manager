import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loading-panel surface-panel text-center" role="status">
      <div class="spinner-border text-primary mb-3" aria-hidden="true"></div>
      <p class="mb-0 hero-subtitle">{{ message() }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly message = input('Cargando...');
}
