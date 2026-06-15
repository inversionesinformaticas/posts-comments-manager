import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MongoIdParamDto } from '../common/dto/mongo-id-param.dto';
import { ApiResponse } from '../common/responses/api-response';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments-query.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByPostId(@Query() query: FindCommentsQueryDto) {
    const comments = await this.commentsService.findByPostId(query.postId);
    return ApiResponse.ok(comments, 'Comments retrieved successfully');
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(createCommentDto);
    return ApiResponse.created(comment, 'Comment created successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param() params: MongoIdParamDto) {
    await this.commentsService.remove(params.id);
    return ApiResponse.ok(null, 'Comment deleted successfully');
  }
}
