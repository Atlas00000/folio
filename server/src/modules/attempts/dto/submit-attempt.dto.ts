import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class JournalLineDto {
  @ApiProperty()
  @IsString()
  account!: string;

  @ApiProperty({ enum: ['debit', 'credit'] })
  @IsIn(['debit', 'credit'])
  direction!: 'debit' | 'credit';

  @ApiProperty()
  @IsString()
  amount!: string;
}

export class SubmitAttemptDto {
  @ApiPropertyOptional({ description: 'MCQ selected option id' })
  @IsOptional()
  @IsString()
  selectedOptionId?: string;

  @ApiPropertyOptional({ description: 'Numerical answer' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ type: [JournalLineDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines?: JournalLineDto[];
}
