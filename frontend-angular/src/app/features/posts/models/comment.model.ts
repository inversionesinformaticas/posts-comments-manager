export interface Comment {
  _id: string;
  postId: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentPayload {
  postId: string;
  name: string;
  email: string;
  body: string;
}
