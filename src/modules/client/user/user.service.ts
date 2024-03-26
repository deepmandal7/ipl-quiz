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

  async insertClient(createUserDto: CreateUserDto) {
    try {
      const insertClient = await this.dbService.executeQuery(
        'SELECT * FROM hr_insert_client($1, $2, $3, $4)',
        [
          createUserDto.username,
          createUserDto.email,
          createUserDto.password,
          AuthUserEnum.CLIENT,
        ],
      );
      if (insertClient.length && insertClient[0].status == 1)
        return insertClient[0];
      throw new UnauthorizedException('Failed to add client');
    } catch (error) {
      throw new HttpException(
        'Failed to add client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getClientByEmailPassword(
    getUserEmailPasswordDto: GetUserEmailPasswordDto,
  ) {
    try {
      const getClientByEmailPassword = await this.dbService.executeQuery(
        'SELECT * FROM hr_get_client_email_password($1, $2, $3)',
        [
          getUserEmailPasswordDto.email,
          getUserEmailPasswordDto.password,
          AuthUserEnum.CLIENT,
        ],
      );
      if (
        getClientByEmailPassword.length &&
        getClientByEmailPassword[0].status == 1
      )
        return getClientByEmailPassword[0];
      throw new UnauthorizedException('Client not found');
    } catch (error) {
      throw new HttpException(
        'Failed to get client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
