// create-watering-records.dto.ts
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActionRecordsDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  plantIds: number[];
}
