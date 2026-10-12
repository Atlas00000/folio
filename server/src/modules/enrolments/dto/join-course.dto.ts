import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinCourseDto {
  @ApiProperty({ example: 'a1b2c3d4', description: 'Course join code' })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  joinCode!: string;
}
