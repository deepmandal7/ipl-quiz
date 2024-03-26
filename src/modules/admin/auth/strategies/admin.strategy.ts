import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from 'src/config/app.config';
import { DatabaseService } from 'src/database/database.service';
import { AuthUserEnum } from 'src/enums/auth.enum';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @Inject(appConfig.KEY)
    private applicationConfig: ConfigType<typeof appConfig>,
    @Inject(DatabaseService) private readonly dbService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: applicationConfig.admin_jwt_secret,
    });
  }

  async validate(payload: any) {
    try {
      const userType = await this.dbService.executeQuery(
        `select * from hr_get_user_type($1)`,
        [payload.userTypeId],
      );

      if (userType.length && (userType[0].userType === AuthUserEnum.ADMIN))
        return payload;
      throw new UnauthorizedException('Unauthorized access');
    } catch {
      throw new ForbiddenException('Auth validation failure');
    }
  }
}
