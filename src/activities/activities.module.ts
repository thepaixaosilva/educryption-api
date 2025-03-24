import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActivitiesController } from './activities.controller'
import { ActivitiesService } from './activities.service'
import { Activity, ActivitySchema } from './schemas/activity.schema'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
    UsersModule, // Importamos para usar o serviço de usuários
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
