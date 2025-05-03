import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Validators } from 'src/utils/helpers/validators.helper';
import { Content } from 'src/contents/schemas/content.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
    @InjectModel('Content')
    private readonly contentModel: Model<Content>,
  ) {}

  private async checkEmailExistence(
    email: string,
    excludeUserId?: string,
  ): Promise<void> {
    const user = await this.usersModel.findOne({ email });
    if (user && user.id !== excludeUserId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.CONFLICT,
        errors: {
          email: 'emailAlreadyExists',
        },
      });
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (createUserDto.email)
      await this.checkEmailExistence(createUserDto.email);

    const cryptedPassword = createUserDto.password
      ? await this.hashPassword(createUserDto.password)
      : undefined;

    const user = await this.usersModel.create({
      fullName: createUserDto.full_name,
      email: createUserDto.email,
      password: cryptedPassword,
      role: createUserDto.role,
      status: createUserDto.status,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersModel.find().select('-password').exec();

    if (users.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noUserFound',
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findById(id: string): Promise<User> {
    Validators.validateId(id, 'User');
    const user = await this.usersModel
      .findOne({ _id: id })
      .select('-password')
      .lean();

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      });
    }

    return user;
  }

  async findByEmail(email: User['email']): Promise<User> {
    const user = await this.usersModel.findOne({ email });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      });
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    Validators.validateId(id, 'User');

    if (updateUserDto.email)
      await this.checkEmailExistence(updateUserDto.email, id);

    const cryptedPassword = updateUserDto.password
      ? await this.hashPassword(updateUserDto.password)
      : undefined;

    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      {
        fullName: updateUserDto.full_name,
        email: updateUserDto.email,
        password: cryptedPassword,
        role: updateUserDto.role,
        status: updateUserDto.status,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async delete(id: string): Promise<void> {
    Validators.validateId(id, 'User');

    const deletedUser = await this.usersModel.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'userNotFound',
        },
      });
    }
  }

  private async isUnitUnlocked(
    userId: string,
    unitId: string,
  ): Promise<boolean> {
    const user = await this.usersModel.findById(userId).lean();
    return !!user?.units_unlocked?.includes(
      new this.usersModel.base.Types.ObjectId(unitId),
    );
  }

  async unlockUnit(userId: string, unitId: string): Promise<void> {
    Validators.validateId(userId, 'User');
    Validators.validateId(unitId, 'Unit');

    const unitAlreadyUnlocked = await this.isUnitUnlocked(userId, unitId);
    if (unitAlreadyUnlocked) {
      throw new BadRequestException('Unit already unlocked');
    }

    await this.usersModel.findByIdAndUpdate(userId, {
      $addToSet: { units_unlocked: unitId },
    });
  }

  async completeUnit(userId: string, unitId: string): Promise<void> {
    Validators.validateId(userId, 'User');
    Validators.validateId(unitId, 'Unit');

    const unitUnlocked = await this.isUnitUnlocked(userId, unitId);
    if (!unitUnlocked) {
      throw new ForbiddenException('Unit not unlocked');
    }

    await this.usersModel.findByIdAndUpdate(userId, {
      $addToSet: { units_completed: unitId },
    });
  }

  async markContentAsRead(
    userId: string,
    unitId: string,
    contentId: string,
  ): Promise<void> {
    Validators.validateId(userId, 'User');
    Validators.validateId(unitId, 'Unit');
    Validators.validateId(contentId, 'Content');

    const unitUnlocked = await this.isUnitUnlocked(userId, unitId);
    if (!unitUnlocked) {
      throw new ForbiddenException('Unit not unlocked');
    }

    const content = await this.contentModel.findById(contentId).lean();
    if (!content) throw new NotFoundException('Content not found');

    if (String(content.unit_id) !== String(unitId)) {
      throw new UnprocessableEntityException(
        'Content does not belong to this unit',
      );
    }

    await this.usersModel.findByIdAndUpdate(userId, {
      $addToSet: { contentsRead: contentId },
    });
  }

  async completeActivity(
    userId: string,
    unitId: string,
    activityId: string,
  ): Promise<void> {
    Validators.validateId(userId, 'User');
    Validators.validateId(unitId, 'Unit');
    Validators.validateId(activityId, 'Activity');

    const unitUnlocked = await this.isUnitUnlocked(userId, unitId);
    if (!unitUnlocked) {
      throw new ForbiddenException('Unit not unlocked');
    }

    const content = await this.contentModel.findById(activityId).lean();
    if (!content) throw new NotFoundException('Content not found');

    if (String(content.unit_id) !== String(unitId)) {
      throw new UnprocessableEntityException(
        'Content does not belong to this unit',
      );
    }

    await this.usersModel.findByIdAndUpdate(userId, {
      $addToSet: { activities_completed: activityId },
    });
  }
}
