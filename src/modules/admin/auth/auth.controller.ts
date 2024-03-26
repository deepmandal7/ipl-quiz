import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthResponseEntity } from './entities/auth.entity';
import { LogInDto } from './dto/login.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up new admin' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('signup')
  async adminSignUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseEntity> {
    return await this.authService.adminSignUp(signUpDto);
  }

  @ApiOperation({ summary: 'Login admin' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('login')
  async adminLogIn(@Body() loginDto: LogInDto): Promise<AuthResponseEntity> {
    return await this.authService.adminLogIn(loginDto);
  }
}
