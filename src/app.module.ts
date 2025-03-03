import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { MongooseConfigService } from './database/mongoose-config.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './database/config/database.config'
import { LoggerMiddleware } from './utils/middlewares/logger.middleware'
import { AuthModule } from './auth/auth.module'
import appConfig from './config/app.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
