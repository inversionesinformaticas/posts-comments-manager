import { Component, computed, input, output } from '@angular/core';

export type ConfirmDialogVariant = 'danger' | 'primary' | 'warning';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="confirm-overlay" (click)="onCancel()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="dialogTitleId"
          (click)="$event.stopPropagation()"
        >
          <div class="confirm-icon" [class]="iconClass()" aria-hidden="true">
            {{ iconSymbol() }}
          </div>
          <h2 class="confirm-title" [id]="dialogTitleId">{{ title() }}</h2>
          <p class="confirm-message">{{ message() }}</p>
          <div class="confirm-actions">
            <button type="button" class="btn-modern btn-outline-secondary" (click)="onCancel()">
              {{ cancelLabel() }}
            </button>
            <button type="button" class="btn-modern" [class]="confirmButtonClass()" (click)="onConfirm()">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  private static idCounter = 0;

  readonly dialogTitleId = `confirm-dialog-title-${ConfirmDialogComponent.idCounter++}`;

  readonly visible = input(false);
  readonly title = input('Confirmar acción');
  readonly message = input('');
  readonly cancelLabel = input('Cancelar');
  readonly confirmLabel = input('Confirmar');
  readonly variant = input<ConfirmDialogVariant>('primary');

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  readonly confirmButtonClass = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'btn-outline-danger';
      case 'warning':
        return 'btn-outline-primary confirm-btn-warning';
      default:
        return 'btn-primary';
    }
  });

  readonly iconClass = computed(() => `confirm-icon--${this.variant()}`);

  readonly iconSymbol = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return '!';
      case 'warning':
        return '?';
      default:
        return 'i';
    }
  });

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
