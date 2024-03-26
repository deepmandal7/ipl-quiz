import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerInit = (app: NestFastifyApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HR management')
    .setDescription('The HR Management API description')
    .setVersion('3.0.3')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .setExternalDoc('Postman Collection', '/docs-json')
    .addTag('HR Management')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  return SwaggerModule.setup('api', app, document);
};
