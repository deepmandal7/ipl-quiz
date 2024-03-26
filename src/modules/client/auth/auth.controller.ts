import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthResponseEntity } from './entities/auth.entity';
import { LogInDto } from './dto/login.dto';

@Controller('client/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up new client' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('signup')
  async clientSignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<AuthResponseEntity> {
    return await this.authService.clientSignUp(signUpDto);
  }

  @ApiOperation({ summary: 'Login client' })
  @ApiOkResponse({ type: AuthResponseEntity })
  @HttpCode(200)
  @Post('login')
  async clientLogIn(@Body() loginDto: LogInDto): Promise<AuthResponseEntity> {
    return await this.authService.clientLogIn(loginDto);
  }
}
