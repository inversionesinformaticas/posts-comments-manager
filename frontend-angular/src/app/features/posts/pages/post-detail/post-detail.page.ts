import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertMessageComponent } from '../../../../shared/components/alert-message/alert-message.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ErrorService } from '../../../../core/services/error.service';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { CommentListComponent } from '../../components/comment-list/comment-list.component';
import { Comment } from '../../models/comment.model';
import { Post } from '../../models/post.model';
import { CommentsService } from '../../services/comments.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    RouterLink,
    AlertMessageComponent,
    LoadingSpinnerComponent,
    DateFormatPipe,
    CommentListComponent,
    CommentFormComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <div class="mb-4">
      <a routerLink="/posts" class="back-link">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver al listado
      </a>
    </div>

    <app-alert-message />

    @if (loading()) {
      <app-loading-spinner message="Cargando publicación..." />
    } @else if (notFound()) {
      <div class="section-card surface-panel text-center py-5">
        <a routerLink="/posts" class="btn-modern btn-primary btn-lg">Volver al listado</a>
      </div>
    } @else {
      @if (post(); as currentPost) {
        <article class="section-card surface-panel mb-4">
          <div class="detail-header">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div class="d-flex align-items-start gap-3 flex-grow-1">
                <span class="panel-icon panel-icon-sm" aria-hidden="true">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </span>
                <div>
                  <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <h1 class="h3 mb-0 fw-semibold">{{ currentPost.title }}</h1>
                    <span [class]="commentBadgeClass(currentPost)">{{ commentBadgeText(currentPost) }}</span>
                  </div>
                  <div class="post-meta-row">
                    <span class="meta-item">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Por {{ currentPost.author }}
                    </span>
                    <span class="meta-item">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                      </svg>
                      {{ currentPost.createdAt | dateFormat }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <a [routerLink]="['/posts', currentPost._id, 'edit']" class="btn-modern btn-outline-primary btn-sm">
                  Editar
                </a>
                <button type="button" class="btn-modern btn-outline-danger btn-sm" (click)="deletePost()">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <p class="post-body-text mb-0">{{ currentPost.body }}</p>
        </article>

        <section class="comments-section surface-panel">
          <h2 class="comments-heading mb-0">
            Comentarios
            <span class="comments-count">{{ comments().length }}</span>
          </h2>

          <app-comment-list
            [comments]="comments()"
            [deletingCommentId]="deletingCommentId()"
            (deleteComment)="deleteComment($event)"
          />

          <app-comment-form
            [submitting]="commentSubmitting()"
            (created)="createComment($event)"
          />
        </section>
      }
    }

    <app-confirm-dialog
      [visible]="deletePostConfirmVisible()"
      title="Eliminar publicación"
      message="Esta acción eliminará la publicación y sus comentarios asociados. No se puede deshacer."
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      (confirm)="confirmDeletePost()"
      (cancel)="cancelDeletePost()"
    />

    <app-confirm-dialog
      [visible]="deleteCommentConfirmVisible()"
      title="Eliminar comentario"
      message="Esta acción eliminará el comentario seleccionado. No se puede deshacer."
      confirmLabel="Eliminar comentario"
      cancelLabel="Cancelar"
      variant="danger"
      (confirm)="confirmDeleteComment()"
      (cancel)="cancelDeleteComment()"
    />
  `,
})
export class PostDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly commentsService = inject(CommentsService);
  private readonly errorService = inject(ErrorService);

  readonly post = signal<Post | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly commentSubmitting = signal(false);
  readonly deletingCommentId = signal<string | null>(null);

  readonly deletePostConfirmVisible = signal(false);
  readonly deleteCommentConfirmVisible = signal(false);
  readonly pendingDeleteComment = signal<Comment | null>(null);

  private postId = '';

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadPost();
  }

  loadPost(): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.errorService.clear();

    this.postsService.getById(this.postId).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
        this.loadComments();
      },
      error: () => {
        this.post.set(null);
        this.notFound.set(true);
        this.loading.set(false);
        this.errorService.clear();
        this.errorService.message.set(
          'La publicación solicitada no existe o fue eliminada.',
        );
      },
    });
  }

  loadComments(): void {
    this.commentsService.getByPostId(this.postId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
      },
    });
  }

  createComment(payload: { name: string; email: string; body: string }): void {
    this.commentSubmitting.set(true);
    this.errorService.clear();

    this.commentsService
      .create({
        postId: this.postId,
        ...payload,
      })
      .subscribe({
        next: (comment) => {
          this.comments.update((items) => [comment, ...items]);
          this.commentSubmitting.set(false);
          this.errorService.setSuccess('Comentario publicado correctamente.');
        },
        error: () => {
          this.commentSubmitting.set(false);
        },
      });
  }

  deleteComment(comment: Comment): void {
    this.pendingDeleteComment.set(comment);
    this.deleteCommentConfirmVisible.set(true);
  }

  confirmDeleteComment(): void {
    const comment = this.pendingDeleteComment();
    if (!comment) {
      this.deleteCommentConfirmVisible.set(false);
      return;
    }

    this.deleteCommentConfirmVisible.set(false);
    this.pendingDeleteComment.set(null);
    this.errorService.clear();
    this.deletingCommentId.set(comment._id);

    this.commentsService.delete(comment._id).subscribe({
      next: () => {
        this.comments.update((items) => items.filter((item) => item._id !== comment._id));
        this.deletingCommentId.set(null);
        this.errorService.setSuccess('Comentario eliminado correctamente.');
      },
      error: () => {
        this.deletingCommentId.set(null);
      },
    });
  }

  cancelDeleteComment(): void {
    this.deleteCommentConfirmVisible.set(false);
    this.pendingDeleteComment.set(null);
  }

  deletePost(): void {
    const currentPost = this.post();
    if (!currentPost) {
      return;
    }

    this.deletePostConfirmVisible.set(true);
  }

  confirmDeletePost(): void {
    const currentPost = this.post();
    if (!currentPost) {
      this.deletePostConfirmVisible.set(false);
      return;
    }

    this.deletePostConfirmVisible.set(false);
    this.errorService.clear();

    this.postsService.delete(currentPost._id).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
    });
  }

  cancelDeletePost(): void {
    this.deletePostConfirmVisible.set(false);
  }

  hasComments(post: Post): boolean {
    const count = post.commentCount;
    return count !== undefined && count > 0;
  }

  commentBadgeText(post: Post): string {
    const count = post.commentCount;

    if (!this.hasComments(post)) {
      return 'Sin comentarios';
    }

    if (count === 1) {
      return '💬 1 comentario';
    }

    return `💬 ${count} comentarios`;
  }

  commentBadgeClass(post: Post): string {
    return this.hasComments(post)
      ? 'comment-count-badge comment-count-badge--active'
      : 'comment-count-badge comment-count-badge--empty';
  }
}
