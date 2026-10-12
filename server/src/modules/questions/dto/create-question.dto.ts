import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class McqOptionDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  label!: string;
}

class JournalLineDto {
  @ApiProperty()
  @IsString()
  account!: string;

  @ApiProperty({ enum: ['debit', 'credit'] })
  @IsIn(['debit', 'credit'])
  direction!: 'debit' | 'credit';

  @ApiProperty({ example: '100.00' })
  @IsString()
  amount!: string;
}

export class CreateQuestionDto {
  @ApiProperty({ enum: ['mcq', 'numerical', 'journal'] })
  @IsIn(['mcq', 'numerical', 'journal'])
  type!: 'mcq' | 'numerical' | 'journal';

  @ApiProperty()
  @IsString()
  @MinLength(3)
  prompt!: string;

  @ApiPropertyOptional({ enum: ['intro', 'core', 'stretch'] })
  @IsOptional()
  @IsIn(['intro', 'core', 'stretch'])
  difficulty?: 'intro' | 'core' | 'stretch';

  @ApiPropertyOptional({ example: '1.00' })
  @IsOptional()
  @IsNumberString()
  marks?: string;

  @ApiPropertyOptional({ type: [McqOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McqOptionDto)
  options?: McqOptionDto[];

  @ApiPropertyOptional({ description: 'MCQ correct option id' })
  @IsOptional()
  @IsString()
  mcqCorrectOptionId?: string;

  @ApiPropertyOptional({ example: '250.00' })
  @IsOptional()
  @IsString()
  numericalValue?: string;

  @ApiPropertyOptional({ example: '0.01' })
  @IsOptional()
  @IsString()
  numericalTolerance?: string;

  @ApiPropertyOptional({ type: [JournalLineDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  journalLines?: JournalLineDto[];

  @ApiPropertyOptional({
    description: 'Canonical account → alternate labels',
    example: { Cash: ['Bank', 'Cash at bank'] },
  })
  @IsOptional()
  @IsObject()
  alternateAccounts?: Record<string, string[]>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hints?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rationale?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  misconceptionTags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  source?: string;
}
