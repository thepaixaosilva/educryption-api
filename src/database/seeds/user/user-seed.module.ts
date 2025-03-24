import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSeedService } from './user-seed.service'
import { User, UserSchema } from '../../../users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
