import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewPlantDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  waterIntervalDays?: number;

  @IsNumber()
  @IsOptional()
  fertilizerIntervalDays?: number;

  @IsDate()
  @IsOptional()
  lastWateredAt?: Date;

  @IsDate()
  @IsOptional()
  lastFertilizedAt?: Date;

  @IsBoolean()
  @IsOptional()
  reminderEnabled: boolean;

  @IsBoolean()
  @IsOptional()
  fertilizerReminderEnabled: boolean;

  @IsArray()
  @IsOptional()
  tags: string[] = [];

  @IsArray()
  @IsOptional()
  notes: string[] = [];

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  humidityPreference?: string;

  @IsString()
  @IsOptional()
  sunlightPreference?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  species?: string;

  @IsString()
  @IsOptional()
  soilType?: string;

  @IsNumber()
  @IsOptional()
  waterAmount?: number;
}
