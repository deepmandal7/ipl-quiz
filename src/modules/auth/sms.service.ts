import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { Twilio } from 'twilio';
  import { SignUpDto } from './dto/signup.dto';
  // import { UsersService } from '../users/users.service';
  
  @Injectable()
  export default class SmsService {
    // private twilioClient: any;
  
    constructor(
      @Inject(ConfigService) private readonly configService: ConfigService,
      private readonly twilioClient: any,
    ) {
      this.twilioClient = new Twilio(
        configService.get('twilio_account_sid'),
        configService.get('twilio_auth_token'),
      );
    }
  
    async initiatePhoneNumberVerification(signUpDto: SignUpDto) {
      try {
        const sendOTP =
          this.configService.get('NODE_ENV') === 'production' ||
          this.configService.get('NODE_ENV') === 'staging'
            ? await this.twilioClient.verify.v2
                .services(
                  this.configService.get('twilio_verification_service_sid'),
                )
                .verifications.create({
                  to: signUpDto.userCountryCode + signUpDto.userMobileNo,
                  channel: 'sms',
                })
            : null;
        return {
          status:
            this.configService.get('NODE_ENV') === 'production' ||
            this.configService.get('NODE_ENV') === 'staging'
              ? sendOTP.status
              : 'pending',
        };
      } catch (error) {
        throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    async confirmPhoneNumber(signUpDto: SignUpDto) {
      try {
        const result =
          this.configService.get('NODE_ENV') === 'production' ||
          this.configService.get('NODE_ENV') === 'staging'
            ? await this.twilioClient.verify.v2
                .services(
                  this.configService.get('twilio_verification_service_sid'),
                )
                .verificationChecks.create({
                  to: signUpDto.userCountryCode + signUpDto.userMobileNo,
                  code: signUpDto.otp,
                })
            : signUpDto.otp === '8888'
            ? { valid: true, status: 'approved' }
            : { valid: false, status: '' };
        if (!result.valid || result.status !== 'approved') {
          throw new BadRequestException('Wrong code provided');
        }
        return result.valid;
      } catch (error) {
        throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  