import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(240)
  title!: string;

  @ApiProperty({
    enum: ['pdf', 'docx', 'slides', 'video_link', 'text_summary'],
  })
  @IsIn(['pdf', 'docx', 'slides', 'video_link', 'text_summary'])
  type!: 'pdf' | 'docx' | 'slides' | 'video_link' | 'text_summary';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  licence?: string;

  @ApiPropertyOptional({ description: 'Required for video_link / optional text' })
  @IsOptional()
  @IsString()
  externalUrl?: string;

  @ApiPropertyOptional({ description: 'Inline text for text_summary' })
  @IsOptional()
  @IsString()
  body?: string;
}
