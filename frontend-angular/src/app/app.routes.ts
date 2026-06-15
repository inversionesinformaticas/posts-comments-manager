import { Routes } from '@angular/router';
import { PostDetailPage } from './features/posts/pages/post-detail/post-detail.page';
import { PostCreatePage, PostEditPage } from './features/posts/pages/post-form/post-form.page';
import { PostsListPage } from './features/posts/pages/posts-list/posts-list.page';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsListPage },
  { path: 'posts/new', component: PostCreatePage },
  { path: 'posts/:id/edit', component: PostEditPage },
  { path: 'posts/:id', component: PostDetailPage },
  { path: '**', redirectTo: 'posts' },
];
