import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MongoIdParamDto } from '../common/dto/mongo-id-param.dto';
import { ApiResponse } from '../common/responses/api-response';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() query: FindPostsQueryDto) {
    const hasPagination =
      query.page !== undefined || query.limit !== undefined;

    if (!hasPagination) {
      const posts = await this.postsService.findAll();
      return ApiResponse.ok(posts, 'Posts retrieved successfully');
    }

    const result = await this.postsService.findAllPaginated({
      page: query.page ?? 1,
      limit: query.limit ?? 6,
      search: query.search,
    });

    return ApiResponse.ok(result, 'Posts retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param() params: MongoIdParamDto) {
    const post = await this.postsService.findOne(params.id);
    return ApiResponse.ok(post, 'Post retrieved successfully');
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    return ApiResponse.created(post, 'Post created successfully');
  }

  @Post('bulk')
  async bulkCreate(
    @Body(
      new ParseArrayPipe({
        items: CreatePostDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createPostDtos: CreatePostDto[],
  ) {
    if (createPostDtos.length === 0) {
      throw new BadRequestException('At least one post is required for bulk upload');
    }

    const posts = await this.postsService.bulkCreate(createPostDtos);
    return ApiResponse.created(posts, 'Posts created successfully');
  }

  @Put(':id')
  async update(
    @Param() params: MongoIdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.update(params.id, updatePostDto);
    return ApiResponse.ok(post, 'Post updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param() params: MongoIdParamDto) {
    await this.postsService.remove(params.id);
    return ApiResponse.ok(null, 'Post deleted successfully');
  }
}
