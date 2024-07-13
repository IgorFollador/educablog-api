import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './shared/middlewares/redoc.middleware';
import { GlobalExceptionFilter } from './shared/filters/global.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  //Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Educablog-API')
    .setDescription('Educablog API - Gestão de postagens escolares')
    .setVersion('1.0')
    .addTag('educablog')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); //Inicialização do Swagger (Documetação/Requisição) da API
  setupRedoc(app); //Documetação detalhada da API
  await app.listen(Number(process.env.PORT_APP) || 3010);
}
bootstrap();
