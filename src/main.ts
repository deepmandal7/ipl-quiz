import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import { swaggerInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
    { bufferLogs: true, bodyParser: true, rawBody: true },
  );

  const configService = app.get(ConfigService);

  const PORT = configService.get('port');
  const NODE_ENV = configService.get('NODE_ENV');
  const APP_VERSION = configService.get('APP_VERSION');

  const logger = new Logger();

  await app.register(helmet);
  await app.register(fastifyCsrf);
  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useLogger(app.get(PinoLogger));
  app.enableShutdownHooks();
  app.enableCors();
  app.setGlobalPrefix(`api/${APP_VERSION}`);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: NODE_ENV === 'production',
    }),
  );
  if (NODE_ENV != 'production') swaggerInit(app);

  await app.listen(PORT, NODE_ENV == 'development' ? '0.0.0.0' : '127.0.0.1');

  logger.log(
    `Application is running on ${configService.get(
      'NODE_ENV',
    )} server: ${await app.getUrl()}`,
  );
}
bootstrap();
