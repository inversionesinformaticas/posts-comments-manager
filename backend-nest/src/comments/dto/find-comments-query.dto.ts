import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindCommentsQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  postId: string;
}
