import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserActivity } from './schemas/user.schema'
import mongoose, { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RoleSchema } from '../roles/entities/role.entity'
import { RoleEnum } from '../roles/roles.enum'
import { StatusSchema } from '../statuses/entities/status.entity'
import { StatusEnum } from '../statuses/statuses.enum'
import { Activity } from '../activities/schemas/activity.schema'
import { SubmitActivityDto } from '../activities/dto/submit-activity.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>
  ) {}

  private async validateId(id: string, type: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          status: `invalid${type}Id`,
        },
      })
    }
  }

  private async checkEmailExistence(email: string, excludeUserId?: string): Promise<void> {
    const user = await this.usersModel.findOne({ email })
    if (user && user.id !== excludeUserId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.CONFLICT,
        errors: {
          email: 'emailAlreadyExists',
        },
      })
    }
  }

  private async checkRoleExistence(roleId: string): Promise<RoleSchema> {
    const roleExists = Object.values(RoleEnum).map(String).includes(String(roleId))
    if (!roleExists) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          role: 'roleNotExists',
        },
      })
    }

    return { _id: roleId }
  }

  private async checkStatusExistence(statusId: string): Promise<StatusSchema> {
    const statusExists = Object.values(StatusEnum).map(String).includes(String(statusId))
    if (!statusExists) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'statusNotExists',
        },
      })
    }

    return { _id: statusId }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (createUserDto.email) await this.checkEmailExistence(createUserDto.email)

    const cryptedPassword = createUserDto.password ? await this.hashPassword(createUserDto.password) : undefined
    const role = createUserDto.role?.id ? await this.checkRoleExistence(createUserDto.role.id) : undefined
    const status = createUserDto.status?.id ? await this.checkStatusExistence(createUserDto.status.id) : undefined

    const user = await this.usersModel.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: cryptedPassword,
      role,
      status,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject()
    return userWithoutPassword
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersModel.find().select('-password').exec()

    if (users.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noUserFound',
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user)
  }

  async findById(id: string): Promise<User> {
    await this.validateId(id, 'User')
    const user = await this.usersModel.findOne({ _id: id }).select('-password').lean()

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }

    return user
  }

  async findByIds(ids: string[]): Promise<User[]> {
    ids.forEach((id) => this.validateId(id, 'User'))

    const users = await this.usersModel
      .find({ _id: { $in: ids } })
      .select('-password')
      .lean()

    if (!users || users.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }

    return users
  }

  async findByEmail(email: User['email']): Promise<User> {
    const user = await this.usersModel.findOne({ email })

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    await this.validateId(id, 'User')

    if (updateUserDto.email) await this.checkEmailExistence(updateUserDto.email, id)

    const cryptedPassword = updateUserDto.password ? await this.hashPassword(updateUserDto.password) : undefined
    const role = updateUserDto.role?.id ? await this.checkRoleExistence(updateUserDto.role.id) : undefined
    const status = updateUserDto.status?.id ? await this.checkStatusExistence(updateUserDto.status.id) : undefined

    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      {
        fullName: updateUserDto.fullName,
        email: updateUserDto.email,
        password: cryptedPassword,
        role,
        status,
      },
      { new: true }
    )

    if (!updatedUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toObject()
    return userWithoutPassword
  }

  async completeActivity(submitActivityDto: SubmitActivityDto, activity: Activity): Promise<User> {
    const user = await this.usersModel.findById(submitActivityDto.user_id).exec()

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }

    const userActivity: UserActivity = {
      activity_id: activity,
      status: 'completed',
    }

    user.activities.push(userActivity)
    return user.save()
  }

  async delete(id: string): Promise<void> {
    await this.validateId(id, 'User')

    const deletedUser = await this.usersModel.findOneAndDelete({ _id: id })

    if (!deletedUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      })
    }
  }
}
