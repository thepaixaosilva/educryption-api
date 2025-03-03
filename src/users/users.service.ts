import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './entities/user.entity'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RoleSchema } from '../roles/entities/role.entity'
import { RoleEnum } from '../roles/roles.enum'
import { StatusSchema } from '../statuses/entities/status.entity'
import { StatusEnum } from '../statuses/statuses.enum'
import { NullableType } from '../utils/types/nullable-type'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt()
      password = await bcrypt.hash(createUserDto.password, salt)
    }

    let email: string | null = null

    if (createUserDto.email) {
      const userObject = await this.usersModel.findOne({
        email: createUserDto.email,
      })
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        })
      }
      email = createUserDto.email
    }

    let role: RoleSchema | undefined = undefined

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum).map(String).includes(String(createUserDto.role.id))
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        })
      }

      role = {
        _id: createUserDto.role.id,
      }
    }

    let status: StatusSchema | undefined = undefined

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum).map(String).includes(String(createUserDto.status.id))
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        })
      }

      status = {
        _id: createUserDto.status.id,
      }
    }

    return this.usersModel.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      role: role,
      status: status,
    })
  }

  async findById(id: string): Promise<NullableType<User>> {
    return this.usersModel
      .findById(id)
      .select('-password')
      .lean()
      .then((user) => {
        if (user) {
          const userObj = user as Record<string, any>
          if (userObj._id && typeof userObj._id !== 'string') {
            if (userObj._id.buffer || userObj._id.toString) {
              userObj._id = userObj._id.toString()
            }
          }

          // Type assertion or use a safer approach to remove properties
          if ('__v' in userObj) delete userObj.__v
          if ('$__' in userObj) delete userObj.$__
        }
        return user
      })
  }

  findByIds(ids: string[]): Promise<User[]> {
    return this.usersModel.find({ _id: { $in: ids } })
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersModel.findOne({ email: email })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    let password: string | undefined = undefined

    if (updateUserDto.password) {
      const userObject = await this.usersModel.findById(id)

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt()
        password = await bcrypt.hash(updateUserDto.password, salt)
      }
    }

    let email: string | null | undefined = undefined

    if (updateUserDto.email) {
      const userObject = await this.usersModel.findOne({
        email: updateUserDto.email,
      })

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        })
      }

      email = updateUserDto.email
    } else if (updateUserDto.email === null) {
      email = null
    }

    let role: RoleSchema | undefined = undefined

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum).map(String).includes(String(updateUserDto.role.id))
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        })
      }

      role = {
        _id: updateUserDto.role.id,
      }
    }

    let status: StatusSchema | undefined = undefined

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum).map(String).includes(String(updateUserDto.status.id))
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        })
      }

      status = {
        _id: updateUserDto.status.id,
      }
    }

    return this.usersModel.findByIdAndUpdate(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      role,
      status,
    })
  }

  async remove(id: string): Promise<void> {
    await this.usersModel.findOneAndDelete({ _id: id })
  }
}
