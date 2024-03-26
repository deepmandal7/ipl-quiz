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

  async insertAdmin(createUserDto: CreateUserDto) {
    try {
      const insertAdmin = await this.dbService.executeQuery(
        'SELECT * FROM hr_insert_user($1, $2, $3, $4)',
        [
          createUserDto.username,
          createUserDto.email,
          createUserDto.password,
          AuthUserEnum.ADMIN,
        ],
      );
      if (insertAdmin.length && insertAdmin[0].status == 1)
        return insertAdmin[0];
      throw new UnauthorizedException('Failed to add admin');
    } catch (error) {
      throw new HttpException(
        'Failed to add admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAdminByEmailPassword(
    getUserEmailPasswordDto: GetUserEmailPasswordDto,
  ) {
    try {
      const getAdminByEmailPassword = await this.dbService.executeQuery(
        'SELECT * FROM hr_get_user_email_password($1, $2, $3)',
        [
          getUserEmailPasswordDto.email,
          getUserEmailPasswordDto.password,
          AuthUserEnum.ADMIN,
        ],
      );
      if (
        getAdminByEmailPassword.length &&
        getAdminByEmailPassword[0].status == 1
      )
        return getAdminByEmailPassword[0];
      throw new UnauthorizedException('Admin not found');
    } catch (error) {
      throw new HttpException(
        'Failed to get admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
