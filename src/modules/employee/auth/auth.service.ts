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
    @Inject(UserService) private readonly employeeUserService: UserService,
    @Inject(PasswordService) private readonly passwordService: PasswordService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async employeeSignUp(signUpDto: SignUpDto) {
    try {
      signUpDto.password = await this.passwordService.hashPassword(
        signUpDto.password,
      );

      const insertEmployee = await this.employeeUserService.insertEmployee(
        signUpDto,
      );
      if (insertEmployee.status == 1)
        return {
          msg: 'Signed up successfully',
          data: await this.getToken(insertEmployee.userId),
        };
      throw new UnauthorizedException('Failed to add employee');
    } catch (error) {
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async employeeLogIn(loginDto: LogInDto) {
    try {
      const getEmployeeByEmailPassword =
        await this.employeeUserService.getEmployeeByEmailPassword(loginDto);
      if (
        getEmployeeByEmailPassword.status == 1 &&
        (await this.passwordService.validatePassword(
          loginDto.password,
          getEmployeeByEmailPassword.password,
        ))
      )
        return {
          msg: 'Logged in successfully',
          data: await this.getToken(getEmployeeByEmailPassword.userId),
        };
      throw new UnauthorizedException('Failed to get employee');
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken(userId: string) {
    try {
      return {
        Authorization: await this.jwtService.signAsync({
          sub: userId,
          usertype: AuthUserEnum.EMPLOYEE,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }
}
