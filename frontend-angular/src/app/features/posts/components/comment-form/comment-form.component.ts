import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [ReactiveFormsModule, AutofocusDirective],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="comment-panel">
      <div class="d-flex align-items-center gap-2 mb-3">
        <span class="panel-icon panel-icon-xs" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          </svg>
        </span>
        <h3 class="h6 fw-semibold mb-0">Nuevo comentario</h3>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label-custom d-block">Nombre</label>
        <input id="name" type="text" class="app-input" formControlName="name" [appAutofocus]="true" />
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <div class="field-feedback">El nombre es obligatorio.</div>
        }
      </div>

      <div class="mb-3">
        <label for="email" class="form-label-custom d-block">Email</label>
        <input id="email" type="email" class="app-input" formControlName="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <div class="field-feedback">Ingresa un email válido.</div>
        }
      </div>

      <div class="mb-4">
        <label for="body" class="form-label-custom d-block">Comentario</label>
        <textarea id="body" rows="3" class="app-input" formControlName="body"></textarea>
        @if (form.controls.body.touched && form.controls.body.invalid) {
          <div class="field-feedback">El comentario es obligatorio.</div>
        }
      </div>

      <button type="submit" class="btn-modern btn-primary btn-lg" [disabled]="form.invalid || submitting()">
        @if (submitting()) {
          Agregando...
        } @else {
          Agregar comentario
        }
      </button>
    </form>
  `,
})
export class CommentFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly submitting = input(false);
  readonly created = output<{ name: string; email: string; body: string }>();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    body: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.created.emit(this.form.getRawValue());
    this.form.reset();
  }
}
