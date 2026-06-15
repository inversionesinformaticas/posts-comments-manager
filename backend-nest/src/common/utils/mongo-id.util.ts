import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function parseMongoId(id: string, fieldName = 'id'): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ${fieldName}`);
  }

  return new Types.ObjectId(id);
}
