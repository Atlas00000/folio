import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class AskTutorDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  questionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  attemptId?: string;
}

export class PreviewTutorDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  message!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  materialIds?: string[];
}
