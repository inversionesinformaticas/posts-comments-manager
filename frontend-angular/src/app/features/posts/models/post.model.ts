export interface Post {
  _id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  author: string;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface PostsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPostsResponse {
  items: Post[];
  pagination: PostsPagination;
}
