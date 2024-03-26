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
import { LogInDto } from './dto/login.dto';
import { PasswordService } from 'src/utils/password/password.service';
import { AuthUserEnum } from 'src/enums/auth.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly clientUserService: UserService,
    @Inject(PasswordService) private readonly passwordService: PasswordService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async clientSignUp(signUpDto: SignUpDto) {
    try {
      signUpDto.password = await this.passwordService.hashPassword(
        signUpDto.password,
      );

      const insertClient = await this.clientUserService.insertClient(signUpDto);
      if (insertClient.status == 1)
        return {
          msg: 'Signed up successfully',
          data: await this.getToken(insertClient.userId),
        };
      throw new UnauthorizedException('Failed to add client');
    } catch (error) {
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clientLogIn(loginDto: LogInDto) {
    try {
      const getClientByEmailPassword =
        await this.clientUserService.getClientByEmailPassword(loginDto);
      if (
        getClientByEmailPassword.status == 1 &&
        (await this.passwordService.validatePassword(
          loginDto.password,
          getClientByEmailPassword.password,
        ))
      )
        return {
          msg: 'Logged in successfully',
          data: await this.getToken(getClientByEmailPassword.userId),
        };
      throw new UnauthorizedException('Failed to get client');
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken(userId: string) {
    try {
      return {
        Authorization: await this.jwtService.signAsync({
          sub: userId,
          usertype: AuthUserEnum.CLIENT,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}
