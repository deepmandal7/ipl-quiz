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
import { AuthUserEnum } from 'src/enums/auth.enum';

@Injectable()
export class EmployeeJwtStrategy extends PassportStrategy(
  Strategy,
  'employee',
) {
  constructor(
    @Inject(appConfig.KEY)
    private applicationConfig: ConfigType<typeof appConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: applicationConfig.employee_jwt_secret,
    });
  }

  validate(payload: any) {
    try {
      if (payload.userType === AuthUserEnum.EMPLOYEE) return payload;
      throw new UnauthorizedException('Unauthorized access');
    } catch {
      throw new ForbiddenException('Auth validation failure');
    }
  }
}
