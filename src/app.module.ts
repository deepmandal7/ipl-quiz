import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import appConfig from './config/app.config';
import securityConfig from './config/security.config';
import loggerConfig from './config/logger.config';
import dbConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule as AdminAuthModule } from './modules/admin/auth/auth.module';
import { UserModule as AdminUserModule } from './modules/admin/user/user.module';
import { AuthModule as ClientAuthModule } from './modules/client/auth/auth.module';
import { UserModule as ClientUserModule } from './modules/client/user/user.module';
import { AuthModule as EmployeeAuthModule } from './modules/employee/auth/auth.module';
import { UserModule as EmployeeUserModule } from './modules/employee/user/user.module';
import { PasswordModule } from './utils/password/password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [appConfig, securityConfig, loggerConfig, dbConfig],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return loggerConfig();
      },
    }),
    DatabaseModule,
    PasswordModule,
    AdminAuthModule,
    AdminUserModule,
    ClientAuthModule,
    ClientUserModule,
    EmployeeAuthModule,
    EmployeeUserModule,
  ],
})
export class AppModule {}
