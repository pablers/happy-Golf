import { IsInt, IsBoolean, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateHoleScoreDto {
    @IsInt()
    @Min(1)
    @Max(18)
    hole: number;

    @IsInt()
    strokes: number;

    @IsInt()
    putts: number;

    @IsBoolean()
    @IsOptional()
    fairwayHit?: boolean;

    @IsString()
    @IsOptional()
    comment?: string;
}
