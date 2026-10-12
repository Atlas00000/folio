import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CsvImportPreviewDto {
  @ApiProperty({
    description: 'CSV text: email,role (role optional, default student)',
    example: 'student1@example.ac.uk,student\nstudent2@example.ac.uk,student',
  })
  @IsString()
  csv!: string;
}

export class CsvImportCommitDto extends CsvImportPreviewDto {
  @ApiPropertyOptional({
    description: 'Must be true to commit after preview',
    example: true,
  })
  @IsOptional()
  @IsIn([true])
  confirm?: true;
}
