import { IsString, IsNotEmpty, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHoleScoreDto } from './create-hole-score.dto';

export class CreateRoundDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  roundType: string;

  @IsString()
  @IsOptional()
  practiceTime?: string;

  @IsString()
  @IsOptional()
  initialWeather?: string;

  @IsString()
  @IsOptional()
  initialWind?: string;

  @IsString()
  @IsOptional()
  turfCondition?: string;

  @IsString()
  @IsOptional()
  greenSpeed?: string;

  @IsString()
  @IsOptional()
  physicalState?: string;

  @IsString()
  @IsOptional()
  mentalState?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHoleScoreDto)
  holeScores: CreateHoleScoreDto[];
}
