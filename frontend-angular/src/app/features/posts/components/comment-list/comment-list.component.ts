import { Component, input, output } from '@angular/core';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    @if (comments().length === 0) {
      <app-empty-state
        title="Sin comentarios"
        description="Sé el primero en dejar un comentario."
      />
    } @else {
      <div>
        @for (comment of comments(); track comment._id) {
          <article class="comment-item">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div class="flex-grow-1">
                <div class="comment-author-line">
                  <strong>{{ comment.name }}</strong>
                  <span class="separator">·</span>
                  <span class="text-muted">{{ comment.email }}</span>
                </div>
                <p class="mb-0 text-secondary">{{ comment.body }}</p>
              </div>
              <button
                type="button"
                class="btn-modern btn-outline-danger btn-sm flex-shrink-0"
                [disabled]="deletingCommentId() === comment._id"
                (click)="deleteComment.emit(comment)"
              >
                @if (deletingCommentId() === comment._id) {
                  Eliminando...
                } @else {
                  Eliminar
                }
              </button>
            </div>
          </article>
        }
      </div>
    }
  `,
})
export class CommentListComponent {
  readonly comments = input.required<Comment[]>();
  readonly deletingCommentId = input<string | null>(null);
  readonly deleteComment = output<Comment>();
}
