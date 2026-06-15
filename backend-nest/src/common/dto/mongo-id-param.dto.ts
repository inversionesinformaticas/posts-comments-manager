import { IsMongoId, IsNotEmpty } from 'class-validator';

export class MongoIdParamDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
