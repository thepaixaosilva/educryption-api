import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UsersService } from '../users/users.service';
import { SubmitActivityDto } from './dto/submit-activity.dto';
import { Validators } from 'src/utils/helpers/validators.helper';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
    private usersService: UsersService,
  ) {}

  private async findActivityById(id: string): Promise<Activity> {
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'activityNotFound',
        },
      });
    }
    return activity;
  }

  private async findActivitiesByUnit(unitId: string): Promise<Activity[]> {
    const activities = await this.activityModel
      .find({ unit_id: unitId })
      .exec();
    if (activities.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noActivitiesFoundForUnit',
        },
      });
    }
    return activities;
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const createdActivity = new this.activityModel(createActivityDto);
    return createdActivity.save();
  }

  async findAll(): Promise<Activity[]> {
    const activities = await this.activityModel.find().exec();
    if (activities.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noActivityFound',
        },
      });
    }
    return activities;
  }

  async findById(id: string): Promise<Activity> {
    Validators.validateId(id, 'Activity');
    return this.findActivityById(id);
  }

  async findByUnit(unitId: string): Promise<Activity[]> {
    Validators.validateId(unitId, 'Unit');
    return this.findActivitiesByUnit(unitId);
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    Validators.validateId(id, 'Activity');
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(id, updateActivityDto, { new: true })
      .exec();
    if (!updatedActivity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'activityNotFound',
        },
      });
    }
    return updatedActivity;
  }

  async delete(id: string): Promise<void> {
    Validators.validateId(id, 'Activity');
    const deletedActivity = await this.activityModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedActivity) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'activityNotFound',
        },
      });
    }
  }

  async submitActivity(
    id: string,
    submitActivityDto: SubmitActivityDto,
  ): Promise<{ activityId: string; userId: string; status: string }> {
    Validators.validateId(id, 'Activity');
    Validators.validateId(submitActivityDto.user_id, 'User');

    const activity = await this.findActivityById(id);
    await this.usersService.completeActivity(submitActivityDto, activity);

    return {
      activityId: id,
      userId: submitActivityDto.user_id,
      status: 'completed',
    };
  }
}
