import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    name: 'userId',
    required: false,
    description: 'ID of the user adding the plant record.',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    name: 'name',
    required: false,
    description: 'Optional name for the plant.',
    example: "Megan's Flower",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    name: 'waterIntervalDays',
    required: false,
    description: 'Optional watering interval in days.',
    example: '7',
  })
  @IsNumber()
  @IsOptional()
  waterIntervalDays?: number;

  @ApiProperty({
    name: 'fertilizerIntervalDays',
    required: false,
    description: 'Optional fertilizer interval in days.',
    example: '30',
  })
  @IsNumber()
  @IsOptional()
  fertilizerIntervalDays?: number;

  @ApiProperty({
    name: 'lastWatered',
    required: false,
    description: 'Optional date when the plant was last watered.',
    example: '2025-06-01',
  })
  @IsDate()
  @IsOptional()
  lastWateredAt?: Date;

  @ApiProperty({
    name: 'lastFertilized',
    required: false,
    description: 'Optional date when the plant was last fertilized.',
    example: '2025-06-01',
  })
  @IsDate()
  @IsOptional()
  lastFertilizedAt?: Date;

  @ApiProperty({
    name: 'reminderEnabled',
    required: false,
    description: 'Optional boolean to toggle watering reminders.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  reminderEnabled: boolean;

  @ApiProperty({
    name: 'fertilizerReminderEnabled',
    required: false,
    description: 'Optional boolean to toggle fertilizing reminders.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  fertilizerReminderEnabled: boolean;

  @ApiProperty({
    name: 'tags',
    required: false,
    description: 'Optional list of plant tags.',
    example: ['flower', 'violets'],
  })
  @IsArray()
  @IsOptional()
  tags: string[] = [];

  @ApiProperty({
    name: 'notes',
    required: false,
    description: 'Optional list of plant notes.',
    example: ['Give one ice cube in lieu of liquid water'],
  })
  @IsArray()
  @IsOptional()
  notes: string[] = [];

  @ApiProperty({
    name: 'location',
    required: false,
    description: 'Optional plant location.',
    example: ['Kitchen'],
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    name: 'humidityPreference',
    required: false,
    description:
      'Optional humidity preference - e.g., "Low", "Medium", "High".',
    example: 'Medium',
  })
  @IsString()
  @IsOptional()
  humidityPreference?: string;

  @ApiProperty({
    name: 'sunlightPreference',
    required: false,
    description:
      'Optional sunlight preference - e.g., "Low", "Medium", "High".',
    example: 'Low',
  })
  @IsString()
  @IsOptional()
  sunlightPreference?: string;

  @ApiProperty({
    name: 'imageUrl',
    required: false,
    description: 'Optional initial image url.',
    example: '',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    name: 'species',
    required: false,
    description: 'Optional plant species name.',
    example: 'african violet',
  })
  @IsString()
  @IsOptional()
  species?: string;

  @ApiProperty({
    name: 'soilType',
    required: false,
    description: 'Optional soil data data.',
    example: 'sandy loam',
  })
  @IsString()
  @IsOptional()
  soilType?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    name: 'waterAmount',
    required: false,
    description: 'Optional watering amount data, in mL',
    example: '100',
  })
  waterAmount?: number;
}
