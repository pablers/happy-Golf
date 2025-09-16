import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GreenSpeed, MentalState, PhysicalState, PracticeTime, RoundType, TurfCondition, Weather, Wind } from '@prisma/client';

export class CreateHoleDto {
    @IsInt()
    holeNumber!: number;

    @IsInt()
    strokes!: number;

    @IsInt()
    putts!: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsBoolean()
    @IsOptional()
    fairwayHit?: boolean;
}

export class CreateRoundDto {
    @IsString()
    @IsNotEmpty()
    id!: string; // The client generates the ID based on date, e.g., rd-2025-01-10

    @IsNumber()
    userHcp!: number;

    @IsString()
    @IsNotEmpty()
    courseId!: string;

    @IsEnum(RoundType)
    roundType!: RoundType;

    @IsEnum(PracticeTime)
    practiceTime!: PracticeTime;

    @IsEnum(Weather)
    initialWeather!: Weather;

    @IsEnum(Wind)
    initialWind!: Wind;

    @IsEnum(TurfCondition)
    turfCondition!: TurfCondition;

    @IsEnum(GreenSpeed)
    greenSpeed!: GreenSpeed;

    @IsEnum(PhysicalState)
    physicalState!: PhysicalState;

    @IsEnum(MentalState)
    mentalState!: MentalState;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHoleDto)
    holes!: CreateHoleDto[];
}
