import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { RoleEnum } from '../../../roles/roles.enum'
import { StatusEnum } from '../../../statuses/statuses.enum'
import { User } from '../../../users/entities/user.entity'

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>
  ) {}

  async run() {
    const admin = await this.model.findOne({
      email: 'miki@domain.com',
    })

    if (!admin) {
      const salt = await bcrypt.genSalt()
      const password = await bcrypt.hash('secret', salt)

      const data = new this.model({
        email: 'miki@domain.com',
        password: password,
        firstName: 'Super',
        lastName: 'Admin',
        role: {
          _id: RoleEnum.admin.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      })
      await data.save()
    }

    const user = await this.model.findOne({
      email: 'lie@domain.com',
    })

    if (!user) {
      const salt = await bcrypt.genSalt()
      const password = await bcrypt.hash('secret', salt)

      const data = new this.model({
        email: 'lie@domain.com',
        password: password,
        firstName: 'Lie',
        lastName: 'the Liar',
        role: {
          _id: RoleEnum.user.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      })

      await data.save()
    }
  }
}
