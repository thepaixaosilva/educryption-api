import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RoleEnum } from '../../../roles/roles.enum';
import { User } from '../../../users/schemas/user.schema';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>,
  ) {}

  async run() {
    const admin = await this.model.findOne({
      email: 'admin@domain.com',
    });

    if (!admin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'admin@domain.com',
        password: password,
        username: 'admin',
        fullName: 'Admin',
        role: {
          _id: RoleEnum.ADMIN.toString(),
        },
        status: 'active',
      });
      await data.save();
    }

    const user = await this.model.findOne({
      email: 'user@domain.com',
    });

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'user@domain.com',
        password: password,
        username: 'user',
        fullName: 'User',
        role: {
          _id: RoleEnum.USER.toString(),
        },
        status: 'active',
      });

      await data.save();
    }
  }
}
