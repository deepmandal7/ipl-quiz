import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'johndoe123' })
  @IsString()
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email Id must not be empty' })
  email: string;

  @ApiProperty({ example: 'John@321' })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;',./<>?])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;',./<>?]{8,}$/,
    { message: 'Password too weak' },
  )
  password: string;
}
