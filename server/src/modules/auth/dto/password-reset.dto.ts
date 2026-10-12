import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({ example: 'ada.lovelace@example.ac.uk' })
  @IsEmail()
  email!: string;
}

export class PasswordResetConfirmDto {
  @ApiProperty()
  @IsString()
  @MinLength(16)
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
