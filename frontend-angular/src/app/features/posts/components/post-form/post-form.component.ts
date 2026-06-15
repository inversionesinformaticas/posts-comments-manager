import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, AutofocusDirective],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="form-card">
      <header class="form-card-header">
        <div class="form-card-heading">
          <span class="form-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </span>
          <div>
            <h1 class="form-card-title">{{ title() }}</h1>
            <p class="form-card-subtitle">Completa la información de la publicación.</p>
          </div>
        </div>
      </header>

      <div class="form-card-body">
        <div class="form-field-group">
          <label for="title" class="form-label-custom">
            Título
            <span class="form-required-dot" aria-hidden="true"></span>
          </label>
          <input
            id="title"
            type="text"
            class="form-field-input"
            formControlName="title"
            placeholder="Título de la publicación"
            [appAutofocus]="true"
          />
          @if (form.controls.title.touched && form.controls.title.hasError('required')) {
            <div class="field-feedback">El título es obligatorio.</div>
          }
          @if (form.controls.title.touched && form.controls.title.hasError('minlength')) {
            <div class="field-feedback">Mínimo 3 caracteres.</div>
          }
          <div class="form-field-footer">
            <span class="form-help-text">Usa un título claro y descriptivo.</span>
            <span class="form-char-count">{{ form.controls.title.value.length }} / 120</span>
          </div>
        </div>

        <div class="form-field-group">
          <label for="author" class="form-label-custom">
            Autor
            <span class="form-required-dot" aria-hidden="true"></span>
          </label>
          <input
            id="author"
            type="text"
            class="form-field-input"
            formControlName="author"
            placeholder="Nombre del autor"
          />
          @if (form.controls.author.touched && form.controls.author.invalid) {
            <div class="field-feedback">El autor es obligatorio.</div>
          }
          <div class="form-field-footer">
            <span class="form-help-text">Indica quién es el autor.</span>
            <span class="form-char-count">{{ form.controls.author.value.length }} / 80</span>
          </div>
        </div>

        <div class="form-field-group">
          <label for="body" class="form-label-custom">
            Contenido del post
            <span class="form-required-dot" aria-hidden="true"></span>
          </label>
          <textarea
            id="body"
            class="form-field-input form-field-textarea"
            formControlName="body"
            placeholder="Contenido de la publicación"
          ></textarea>
          @if (form.controls.body.touched && form.controls.body.hasError('required')) {
            <div class="field-feedback">El contenido es obligatorio.</div>
          }
          @if (form.controls.body.touched && form.controls.body.hasError('minlength')) {
            <div class="field-feedback">Mínimo 10 caracteres.</div>
          }
          <div class="form-field-footer">
            <span class="form-help-text">Escribe el contenido principal de la publicación.</span>
            <span class="form-char-count">{{ form.controls.body.value.length }} / 10000</span>
          </div>
        </div>

        <footer class="form-actions">
          <button type="submit" class="btn-modern btn-primary btn-lg" [disabled]="form.invalid || submitting()">
            @if (submitting()) {
              Guardando...
            } @else {
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              {{ submitLabel() }}
            }
          </button>
          <button type="button" class="btn-modern btn-outline-secondary btn-lg" (click)="cancelled.emit()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Cancelar
          </button>
        </footer>
      </div>
    </form>
  `,
})
export class PostFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly title = input('Nuevo post');
  readonly submitLabel = input('Crear post');
  readonly submitting = input(false);
  readonly post = input<Post | null>(null);
  readonly saved = output<{ title: string; body: string; author: string }>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    author: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const value = this.post();
      if (value) {
        this.form.patchValue({
          title: value.title,
          body: value.body,
          author: value.author,
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit(this.form.getRawValue());
  }
}
