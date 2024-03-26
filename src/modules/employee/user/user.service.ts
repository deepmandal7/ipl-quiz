import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { GetUserEmailPasswordDto } from './get-user-email-password.dto';
import { AuthUserEnum } from 'src/enums/auth.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseService) private readonly dbService: DatabaseService,
  ) {}

  async insertEmployee(createUserDto: CreateUserDto) {
    try {
      const insertEmployee = await this.dbService.executeQuery(
        'SELECT * FROM hr_insert_employee($1, $2, $3, $4)',
        [
          createUserDto.username,
          createUserDto.email,
          createUserDto.password,
          AuthUserEnum.EMPLOYEE,
        ],
      );
      if (insertEmployee.length && insertEmployee[0].status == 1)
        return insertEmployee[0];
      throw new UnauthorizedException('Failed to add employee');
    } catch (error) {
      throw new HttpException(
        'Failed to add employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEmployeeByEmailPassword(
    getUserEmailPasswordDto: GetUserEmailPasswordDto,
  ) {
    try {
      const getEmployeeByEmailPassword = await this.dbService.executeQuery(
        'SELECT * FROM hr_get_employee_email_password($1, $2, $3)',
        [
          getUserEmailPasswordDto.email,
          getUserEmailPasswordDto.password,
          AuthUserEnum.EMPLOYEE,
        ],
      );
      if (
        getEmployeeByEmailPassword.length &&
        getEmployeeByEmailPassword[0].status == 1
      )
        return getEmployeeByEmailPassword[0];
      throw new UnauthorizedException('Employee not found');
    } catch (error) {
      throw new HttpException(
        'Failed to get employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
