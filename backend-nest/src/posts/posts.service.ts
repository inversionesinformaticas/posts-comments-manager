import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { parseMongoId } from '../common/utils/mongo-id.util';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatedPostsResult } from './interfaces/paginated-posts.interface';
import { PostWithCommentCount } from './interfaces/post-with-comment-count.interface';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async findAll(): Promise<PostWithCommentCount[]> {
    const posts = await this.postModel.find().sort({ createdAt: -1 }).exec();
    return this.attachCommentCounts(posts);
  }

  async findAllPaginated(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<PaginatedPostsResult> {
    const { page, limit, search } = options;
    const filter = this.buildSearchFilter(search);
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.postModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
    const itemsWithCommentCounts = await this.attachCommentCounts(items);

    return {
      items: itemsWithCommentCounts,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  private buildSearchFilter(search?: string): FilterQuery<PostDocument> {
    const term = search?.trim();

    if (!term) {
      return {};
    }

    return {
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { author: { $regex: term, $options: 'i' } },
      ],
    };
  }

  async findOne(id: string): Promise<PostWithCommentCount> {
    const post = await this.postModel.findById(parseMongoId(id)).exec();

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const commentCount = await this.commentModel
      .countDocuments({ postId: post._id })
      .exec();

    return {
      ...post.toObject(),
      commentCount,
    };
  }

  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postModel.create(createPostDto);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostDocument> {
    const post = await this.postModel
      .findByIdAndUpdate(parseMongoId(id), updatePostDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async remove(id: string): Promise<void> {
    const objectId = parseMongoId(id);
    const post = await this.postModel.findById(objectId).exec();

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    await this.postModel.findByIdAndDelete(objectId).exec();
    await this.commentModel.deleteMany({ postId: objectId }).exec();
  }

  async bulkCreate(createPostDtos: CreatePostDto[]): Promise<PostDocument[]> {
    return this.postModel.insertMany(createPostDtos, { ordered: true });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.postModel
      .countDocuments({ _id: parseMongoId(id) })
      .exec();

    return count > 0;
  }

  private async getCommentCountMap(
    postIds: Types.ObjectId[],
  ): Promise<Map<string, number>> {
    if (postIds.length === 0) {
      return new Map();
    }

    const counts = await this.commentModel
      .aggregate<{ _id: Types.ObjectId; commentCount: number }>([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: '$postId', commentCount: { $sum: 1 } } },
      ])
      .exec();

    return new Map(
      counts.map((item) => [item._id.toString(), item.commentCount]),
    );
  }

  private mapPostWithCommentCount(
    post: PostDocument,
    countMap: Map<string, number>,
  ): PostWithCommentCount {
    return {
      ...post.toObject(),
      commentCount: countMap.get(post._id.toString()) ?? 0,
    };
  }

  private async attachCommentCounts(
    posts: PostDocument[],
  ): Promise<PostWithCommentCount[]> {
    const countMap = await this.getCommentCountMap(
      posts.map((post) => post._id),
    );

    return posts.map((post) =>
      this.mapPostWithCommentCount(post, countMap),
    );
  }
}
