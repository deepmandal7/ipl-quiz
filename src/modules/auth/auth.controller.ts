import { Controller, Get, Post, Body, HttpCode, Inject, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthResponseEntity } from './entities/auth.entity';
import SmsService from './sms.service';


@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @Inject(SmsService) private readonly smsService: SmsService,
    ) {}

  @ApiOperation({ summary: 'Sign up new admin' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.authService.signUp(signUpDto);
  }

 

  @ApiOperation({ summary: 'Send OTP on mobile for verification' })
  @ApiOkResponse({ type: AuthResponseEntity })
  @Post('send-otp')
  @HttpCode(200)
  async initiatePhoneNumberVerification(
    @Body() signUpDto: SignUpDto,
  ): Promise<any> {
    const response = await this.smsService.initiatePhoneNumberVerification(
      signUpDto,
    );
    if (typeof response !== 'string')
      return {
        message: 'Sent OTP successfully',
        data: response,
      };

    throw new ConflictException({
      message: response,
      data: {},
    });
  }
}
