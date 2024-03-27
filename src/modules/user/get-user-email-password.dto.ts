import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserEmailPasswordDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email Id must not be empty' })
  email: string;

  @ApiProperty({ example: 'John@321' })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
