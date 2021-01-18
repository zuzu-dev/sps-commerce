import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exception.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { StoreIdInterceptor } from './shared/current.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true,
  });
  //app.useGlobalInterceptors(new StoreIdInterceptor());

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
