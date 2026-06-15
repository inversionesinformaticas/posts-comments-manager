import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="empty-state surface-panel">
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
        <div class="empty-state-art" aria-hidden="true"></div>
        <div class="text-center text-md-start">
          <h2 class="empty-state-title">{{ title() }}</h2>
          <p class="empty-state-desc">{{ description() }}</p>
          @if (actionLink()) {
            <a [routerLink]="actionLink()!" class="btn-modern btn-primary btn-lg">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              {{ actionLabel() }}
            </a>
          }
        </div>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Sin resultados');
  readonly description = input('No hay datos para mostrar.');
  readonly actionLink = input<string | null>(null);
  readonly actionLabel = input('Nuevo post');
}
