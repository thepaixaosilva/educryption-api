import 'dotenv/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './utils/filters/http-exception.filter'
import validationOptions from './utils/validations-options'
import { ResolvePromisesInterceptor } from './utils/interceptors/serializer.interceptor'
import { useContainer } from 'class-validator'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from './config/config.type'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { TransformInterceptor } from './utils/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  const configService = app.get(ConfigService<AllConfigType>)

  app.enableShutdownHooks()
  app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
    exclude: ['/'],
  })
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor()
  )

  const options = new DocumentBuilder().setTitle('EduCryption').setDescription('The EduCryption API docs.').setVersion('0.2').addBearerAuth().build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
