import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/utils/password/password.service';
import { AuthUserEnum } from 'src/enums/auth.enum';
import SmsService from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(SmsService) private readonly smsService: SmsService,
  ) {}

 

  async signUp(
    signUpDto: SignUpDto
  ): Promise<
      { verified: boolean } | string | { status: number; msg: string }
  > {
    try {
     

      // Confirm the provided phone number
      const confirmPhoneNumber = await this.smsService.confirmPhoneNumber(
        signUpDto,
      );

      

      

      // Generate and return a new authentication token
      const token = await this.getToken(null, null, { usercountrycode: signUpDto.userCountryCode, usermobileno: signUpDto.userMobileNo });

      // If the authentication token is a string, return the verification status
      if (typeof token == 'string') return { verified: confirmPhoneNumber };

      const insertAdmin = await this.userService.insertUser(signUpDto);

      // Return the authentication token
      return token;
    } catch (error) {
      // Handle specific error case for wrong code provided during confirmation
      if (error.response.error == 'BadRequestException: Wrong code provided')
        return 'Wrong code provided';

      // Handle other errors and return the error message
      throw new UnauthorizedException('Failed to generate token');
    }
  }



  async getToken(
    userId: string = null,
    userEmailId: string = null,
    userMobile: { usercountrycode: string; usermobileno: string } | null,
  ): Promise<string> {
    try {
      
      const userDetails = await this.userService.getUserById(
        userId,
        userEmailId,
        userMobile.usermobileno,
      );

      // Check if user details are found
      if (typeof userDetails == 'string') {
        return 'User not found';
      }

      // Generate and return an authentication token
      return {
        ...userDetails,
        Authorization: await this.jwtService.signAsync({
          usercountrycode: userDetails.usercountrycode,
          usermobileno: userDetails.usermobileno,
        }),
      };
    } catch (error) {
      // Handle errors and return the error message
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}