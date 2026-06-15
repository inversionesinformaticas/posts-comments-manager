import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Comment, CreateCommentPayload } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getByPostId(postId: string): Observable<Comment[]> {
    return of(postId).pipe(
      delay(150),
      switchMap((id) =>
        this.http.get<ApiResponse<Comment[]>>(`${this.apiUrl}/comments`, {
          params: new HttpParams().set('postId', id),
        }),
      ),
      retry(2),
      tap((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      switchMap((response) => of(response.data ?? [])),
      catchError((error) => throwError(() => error)),
    );
  }

  create(payload: CreateCommentPayload): Observable<Comment> {
    return of(payload).pipe(
      switchMap((body) =>
        this.http.post<ApiResponse<Comment>>(`${this.apiUrl}/comments`, body),
      ),
      tap((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message);
        }
      }),
      switchMap((response) => of(response.data as Comment)),
      catchError((error) => throwError(() => error)),
    );
  }

  delete(id: string): Observable<void> {
    return of(id).pipe(
      switchMap((commentId) =>
        this.http.delete<ApiResponse<null>>(`${this.apiUrl}/comments/${commentId}`),
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
