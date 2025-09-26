import { IsString, IsDateString, IsEnum, IsArray, ValidateNested, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { RoundType, PracticeTime, WeatherCondition, WindCondition } from '@prisma/client';

class HoleScoreDto {
    @IsNumber()
    hole: number;

    @IsNumber()
    par: number;

    @IsNumber()
    strokeIndex: number;

    @IsOptional()
    @IsNumber()
    strokes: number | null;

    @IsOptional()
    @IsNumber()
    putts: number | null;

    @IsOptional()
    @IsString()
    comment: string | null;

    @IsOptional()
    @IsBoolean()
    fairwayHit: boolean | null;
}

export class CreateRoundDto {
    @IsDateString()
    date: string;

    @IsEnum(RoundType)
    roundType: RoundType;

    @IsEnum(PracticeTime)
    practiceTime: PracticeTime;

    @IsEnum(WeatherCondition)
    weather: WeatherCondition;

    @IsEnum(WindCondition)
    wind: WindCondition;

    @IsString()
    courseId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HoleScoreDto)
    scores: HoleScoreDto[];

    @IsObject()
    answers: any;
}