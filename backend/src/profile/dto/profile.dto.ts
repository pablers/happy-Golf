import { IsString, IsNotEmpty, IsArray, ValidateNested, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UserProfile, HcpRecord } from '../../users/user.interface';

export class HcpRecordDto implements HcpRecord {
  @IsDateString()
  date!: string;

  @IsNumber()
  hcp!: number;
}

export class UpdateProfileDto implements UserProfile {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HcpRecordDto)
  hcpHistory!: HcpRecordDto[];

  @IsArray()
  @IsString({ each: true })
  favoriteCourseIds!: string[];

  @IsString()
  trainingObjective!: string;
}
