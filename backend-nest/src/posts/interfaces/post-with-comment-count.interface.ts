import { Post } from '../schemas/post.schema';

export interface PostWithCommentCount extends Post {
  commentCount: number;
}
