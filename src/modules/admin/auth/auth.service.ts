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
    @Inject(UserService) private readonly adminUserService: UserService,
    @Inject(PasswordService) private readonly passwordService: PasswordService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async adminSignUp(signUpDto: SignUpDto) {
    try {
      signUpDto.password = await this.passwordService.hashPassword(
        signUpDto.password,
      );

      const insertAdmin = await this.adminUserService.insertAdmin(signUpDto);
      if (insertAdmin.status == 1)
        return {
          msg: 'Signed up successfully',
          data: await this.getToken(insertAdmin.userId),
        };
      throw new UnauthorizedException('Failed to add admin');
    } catch (error) {
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async adminLogIn(loginDto: LogInDto) {
    try {
      const getAdminByEmailPassword =
        await this.adminUserService.getAdminByEmailPassword(loginDto);
      if (
        getAdminByEmailPassword.status == 1 &&
        (await this.passwordService.validatePassword(
          loginDto.password,
          getAdminByEmailPassword.password,
        ))
      )
        return {
          msg: 'Logged in successfully',
          data: await this.getToken(getAdminByEmailPassword.userId),
        };
      throw new UnauthorizedException('Failed to get admin');
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken(userId: string) {
    try {
      return {
        Authorization: await this.jwtService.signAsync({
          sub: userId,
          usertype: AuthUserEnum.ADMIN,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}
