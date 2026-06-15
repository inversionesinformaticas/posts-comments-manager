import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../../../../core/services/error.service';
import { AlertMessageComponent } from '../../../../shared/components/alert-message/alert-message.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    RouterLink,
    AlertMessageComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PostCardComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <section class="page-hero surface-panel mb-4">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-4">
        <div class="d-flex align-items-center gap-4 flex-grow-1">
          <span class="panel-icon-hero" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </span>
          <div>
            <h1 class="hero-title">Publicaciones</h1>
            <p class="hero-subtitle">
              Administra publicaciones y comentarios desde un único lugar.
            </p>
            @if (!loading()) {
              <span class="hero-stat-badge">
                <span class="stat-number">{{ totalItems() }}</span>
                {{
                  totalItems() === 1
                    ? 'publicación registrada'
                    : 'publicaciones registradas'
                }}
              </span>
            }
          </div>
        </div>
        <a routerLink="/posts/new" class="btn-modern btn-primary btn-lg align-self-sm-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nuevo post
        </a>
      </div>
    </section>

    <app-alert-message />

    <section class="search-panel surface-panel mb-4">
      <div class="search-panel-header d-flex align-items-start gap-3">
        <span class="panel-icon panel-icon-sm" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </span>
        <div>
          <p class="search-label">Buscar publicaciones</p>
          <p class="search-hint">Filtra por título o autor</p>
        </div>
      </div>
      <div class="search-input-wrap">
        <input
          id="search"
          type="search"
          class="app-input"
          placeholder="Buscar por título o autor..."
          [value]="searchTerm()"
          (input)="onSearch($event)"
        />
        <span class="search-input-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </span>
      </div>
    </section>

    @if (loading()) {
      <app-loading-spinner message="Cargando publicaciones..." />
    } @else if (posts().length === 0) {
      <app-empty-state
        [title]="isEmptyCatalog() ? 'No hay publicaciones' : 'Sin coincidencias'"
        [description]="
          isEmptyCatalog()
            ? 'Comienza creando tu primera publicación.'
            : 'Prueba con otro término de búsqueda.'
        "
        [actionLink]="isEmptyCatalog() ? '/posts/new' : null"
        actionLabel="Nuevo post"
      />
    } @else {
      <div class="row g-4">
        @for (post of posts(); track post._id) {
          <div class="col-12 col-md-6 col-lg-4">
            <app-post-card [post]="post" (deletePost)="deletePost($event)" />
          </div>
        }
      </div>

      <nav class="pagination-panel surface-panel mt-4" aria-label="Paginación de publicaciones">
        <button
          type="button"
          class="btn-modern btn-outline-secondary btn-sm"
          [disabled]="isFirstPage()"
          (click)="goToPreviousPage()"
        >
          Anterior
        </button>
        <span class="pagination-info">
          Página {{ currentPage() }} / {{ totalPages() }}
        </span>
        <button
          type="button"
          class="btn-modern btn-outline-secondary btn-sm"
          [disabled]="isLastPage()"
          (click)="goToNextPage()"
        >
          Siguiente
        </button>
      </nav>
    }

    <app-confirm-dialog
      [visible]="deleteConfirmVisible()"
      title="Eliminar publicación"
      message="Esta acción eliminará la publicación y sus comentarios asociados. No se puede deshacer."
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      variant="danger"
      (confirm)="confirmDeletePost()"
      (cancel)="cancelDeletePost()"
    />
  `,
})
export class PostsListPage implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly errorService = inject(ErrorService);

  readonly posts = signal<Post[]>([]);
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalItems = signal(0);
  readonly loading = signal(true);

  readonly isEmptyCatalog = computed(
    () => this.totalItems() === 0 && this.searchTerm().trim().length === 0,
  );

  readonly isFirstPage = computed(() => this.currentPage() <= 1);

  readonly isLastPage = computed(
    () => this.totalPages() === 0 || this.currentPage() >= this.totalPages(),
  );

  readonly deleteConfirmVisible = signal(false);
  readonly pendingDeletePostId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.loadPosts();
  }

  goToPreviousPage(): void {
    if (this.isFirstPage()) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.loadPosts();
  }

  goToNextPage(): void {
    if (this.isLastPage()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.errorService.clear();

    this.postsService
      .getPaginated(this.currentPage(), PAGE_SIZE, this.searchTerm())
      .subscribe({
        next: (result) => {
          this.posts.set(result.items);
          this.totalItems.set(result.pagination.totalItems);
          this.totalPages.set(result.pagination.totalPages);
          this.currentPage.set(result.pagination.page);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  deletePost(id: string): void {
    this.pendingDeletePostId.set(id);
    this.deleteConfirmVisible.set(true);
  }

  confirmDeletePost(): void {
    const id = this.pendingDeletePostId();
    if (!id) {
      this.deleteConfirmVisible.set(false);
      return;
    }

    this.deleteConfirmVisible.set(false);
    this.pendingDeletePostId.set(null);
    this.errorService.clear();

    this.postsService.delete(id).subscribe({
      next: () => {
        if (this.posts().length === 1 && this.currentPage() > 1) {
          this.currentPage.update((page) => page - 1);
        }

        this.loadPosts();
      },
    });
  }

  cancelDeletePost(): void {
    this.deleteConfirmVisible.set(false);
    this.pendingDeletePostId.set(null);
  }
}
