import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'comments',
})
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true, index: true })
  postId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  body: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
