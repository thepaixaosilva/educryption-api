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
import { UnitsModule } from './units/units.module'
import { ActivitiesModule } from './activities/activities.module'
import { ContentsModule } from './contents/contents.module'
import { CommentsModule } from './comments/comments.module'
import appConfig from './config/app.config'
import authConfig from './auth/config/auth.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    UsersModule,
    AuthModule,
    UnitsModule,
    ActivitiesModule,
    ContentsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
