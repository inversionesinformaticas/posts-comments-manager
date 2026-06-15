import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessageComponent } from '../../../../shared/components/alert-message/alert-message.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorService } from '../../../../core/services/error.service';
import { PostFormComponent } from '../../components/post-form/post-form.component';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [AlertMessageComponent, LoadingSpinnerComponent, PostFormComponent],
  template: `
    <div class="post-form-page">
      <app-alert-message />

      <div class="post-form-page__container">
        @if (submitting()) {
          <app-loading-spinner message="Creando publicación..." />
        } @else {
          <app-post-form
            title="Nuevo post"
            submitLabel="Crear post"
            [submitting]="submitting()"
            (saved)="createPost($event)"
            (cancelled)="goBack()"
          />
        }
      </div>
    </div>
  `,
})
export class PostCreatePage {
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly errorService = inject(ErrorService);

  readonly submitting = signal(false);

  createPost(payload: { title: string; body: string; author: string }): void {
    this.submitting.set(true);
    this.errorService.clear();

    this.postsService.create(payload).subscribe({
      next: (post) => {
        this.router.navigate(['/posts', post._id]);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [AlertMessageComponent, LoadingSpinnerComponent, PostFormComponent],
  template: `
    <div class="post-form-page">
      <app-alert-message />

      <div class="post-form-page__container">
        @if (loading()) {
          <app-loading-spinner message="Cargando publicación..." />
        } @else {
          @if (post(); as currentPost) {
            <app-post-form
              title="Editar post"
              submitLabel="Guardar cambios"
              [post]="currentPost"
              [submitting]="submitting()"
              (saved)="updatePost($event)"
              (cancelled)="goBack()"
            />
          }
        }
      </div>
    </div>
  `,
})
export class PostEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly errorService = inject(ErrorService);

  readonly post = signal<Post | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);

  private postId = '';

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadPost();
  }

  loadPost(): void {
    this.errorService.clear();

    this.postsService.getById(this.postId).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  updatePost(payload: { title: string; body: string; author: string }): void {
    this.submitting.set(true);
    this.errorService.clear();

    this.postsService.update(this.postId, payload).subscribe({
      next: () => {
        this.router.navigate(['/posts', this.postId]);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/posts', this.postId]);
  }
}
