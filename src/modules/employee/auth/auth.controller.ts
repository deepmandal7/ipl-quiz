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

@Controller('employee/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up new employee' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('signup')
  async employeeSignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<AuthResponseEntity> {
    return await this.authService.employeeSignUp(signUpDto);
  }

  @ApiOperation({ summary: 'Login employee' })
  @ApiOkResponse({ type: AuthResponseEntity })
  @HttpCode(200)
  @Post('login')
  async employeeLogIn(@Body() loginDto: LogInDto): Promise<AuthResponseEntity> {
    return await this.authService.employeeLogIn(loginDto);
  }
}
