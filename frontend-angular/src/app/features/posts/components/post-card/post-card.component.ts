import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, DateFormatPipe],
  template: `
    <article class="post-card" [class.post-card--has-comments]="hasComments()">
      <div class="post-card-inner">
        <div class="post-card-header d-flex align-items-start justify-content-between gap-2 mb-2">
          <div class="d-flex align-items-start gap-2 flex-grow-1 min-w-0">
            <span class="panel-icon panel-icon-xs flex-shrink-0" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </span>
            <h2 class="post-card-title-wrap mb-0 min-w-0">
              <a [routerLink]="['/posts', post()._id]" class="post-card-title">
                {{ post().title }}
              </a>
            </h2>
          </div>
          <span [class]="commentBadgeClass()">{{ commentBadgeText() }}</span>
        </div>

        <div class="post-meta-row">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Por {{ post().author }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
            {{ post().createdAt | dateFormat }}
          </span>
        </div>

        <hr class="post-card-divider" />

        <div class="post-card-content">
          <p class="post-card-body">{{ post().body }}</p>
        </div>

        <div class="post-card-actions">
          <a [routerLink]="['/posts', post()._id]" class="btn-modern btn-primary btn-sm">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Ver detalle
          </a>
          <a [routerLink]="['/posts', post()._id, 'edit']" class="btn-modern btn-outline-primary btn-sm">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
            </svg>
            Editar
          </a>
          <button type="button" class="btn-modern btn-outline-danger btn-sm" (click)="deletePost.emit(post()._id)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly deletePost = output<string>();

  hasComments(): boolean {
    const count = this.post().commentCount;
    return count !== undefined && count > 0;
  }

  commentBadgeText(): string {
    const count = this.post().commentCount;

    if (!this.hasComments()) {
      return 'Sin comentarios';
    }

    if (count === 1) {
      return '💬 1 comentario';
    }

    return `💬 ${count} comentarios`;
  }

  commentBadgeClass(): string {
    return this.hasComments()
      ? 'comment-count-badge comment-count-badge--active'
      : 'comment-count-badge comment-count-badge--empty';
  }
}
