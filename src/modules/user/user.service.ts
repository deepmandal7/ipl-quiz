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

  async insertUser(createUserDto: CreateUserDto) {
    try {
      const insertAdmin = await this.dbService.executeQuery(
        'SELECT * FROM ipl_insert_user($1, $2, $3, $4, $5, $6)',
        [ createUserDto.firstName,
          createUserDto.lastName,
          createUserDto.email,
          createUserDto.userMobileNo,
          createUserDto.userCountryCode,
          createUserDto.status
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

  async getUserById(
    userId : string,
    userEmailId: string,
    userMobile: string,
  ) {
    try {
      const getUser = await this.dbService.executeQuery(
        'SELECT * FROM ipl_get_user_by_id($1, $2, $3)',
        [
          userId,
          userEmailId,
          userMobile,
        ],
      );
      if (
        getUser.length > 0 
      )
        return getUser[0];
      throw new UnauthorizedException('User not found');
    } catch (error) {
      throw new HttpException(
        'Failed to get admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
