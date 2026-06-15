import { PostWithCommentCount } from './post-with-comment-count.interface';

export interface PostsPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPostsResult {
  items: PostWithCommentCount[];
  pagination: PostsPaginationMeta;
}
