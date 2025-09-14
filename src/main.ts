import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import { GlobalResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cocos Trading Api')
    .setDescription('API documentation for the Cocos Trading application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalFilters(app.get(GlobalHttpExceptionFilter));
  app.useGlobalInterceptors(app.get(GlobalResponseInterceptor));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
