import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  CreatePostPayload,
  PaginatedPostsResponse,
  Post,
  UpdatePostPayload,
} from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Observable<PaginatedPostsResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    const term = search?.trim();
    if (term) {
      params = params.set('search', term);
    }

    return of(null).pipe(
      delay(200),
      switchMap(() =>
        this.http.get<ApiResponse<PaginatedPostsResponse>>(`${this.apiUrl}/posts`, {
          params,
        }),
      ),
      retry(2),
      tap((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'No se pudieron cargar las publicaciones.');
        }
      }),
      switchMap((response) => of(response.data as PaginatedPostsResponse)),
      catchError((error) => throwError(() => error)),
    );
  }

  getById(id: string): Observable<Post> {
    return of(id).pipe(
      delay(150),
      switchMap((postId) =>
        this.http.get<ApiResponse<Post>>(`${this.apiUrl}/posts/${postId}`),
      ),
      retry(2),
      tap((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Post no encontrado.');
        }
      }),
      switchMap((response) => of(response.data as Post)),
      catchError((error) => throwError(() => error)),
    );
  }

  create(payload: CreatePostPayload): Observable<Post> {
    return of(payload).pipe(
      switchMap((body) =>
        this.http.post<ApiResponse<Post>>(`${this.apiUrl}/posts`, body),
      ),
      tap((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message);
        }
      }),
      switchMap((response) => of(response.data as Post)),
      catchError((error) => throwError(() => error)),
    );
  }

  update(id: string, payload: UpdatePostPayload): Observable<Post> {
    return of({ id, payload }).pipe(
      switchMap(({ id: postId, payload: body }) =>
        this.http.put<ApiResponse<Post>>(`${this.apiUrl}/posts/${postId}`, body),
      ),
      tap((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message);
        }
      }),
      switchMap((response) => of(response.data as Post)),
      catchError((error) => throwError(() => error)),
    );
  }

  delete(id: string): Observable<void> {
    return of(id).pipe(
      switchMap((postId) =>
        this.http.delete<ApiResponse<null>>(`${this.apiUrl}/posts/${postId}`),
      ),
      tap((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      switchMap(() => of(void 0)),
      catchError((error) => throwError(() => error)),
    );
  }
}
