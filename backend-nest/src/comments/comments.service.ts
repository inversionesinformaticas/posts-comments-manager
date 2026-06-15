import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parseMongoId } from '../common/utils/mongo-id.util';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly postsService: PostsService,
  ) {}

  async findByPostId(postId: string): Promise<CommentDocument[]> {
    await this.ensurePostExists(postId);

    return this.commentModel
      .find({ postId: parseMongoId(postId, 'postId') })
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    await this.ensurePostExists(createCommentDto.postId);

    return this.commentModel.create({
      ...createCommentDto,
      postId: parseMongoId(createCommentDto.postId, 'postId'),
    });
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentModel
      .findByIdAndDelete(parseMongoId(id))
      .exec();

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }

  private async ensurePostExists(postId: string): Promise<void> {
    const exists = await this.postsService.exists(postId);

    if (!exists) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
  }
}
