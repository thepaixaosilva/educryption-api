import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  // UseGuards
} from '@nestjs/common'
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
import { ActivitiesService } from './activities.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'
import { SubmitActivityDto } from './dto/submit-activity.dto'
import { Activity } from './schemas/activity.schema'

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
  @Post()
  create(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(createActivityDto)
  }

  @Get()
  findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findById(id)
  }

  @Get('unit/:unitId')
  findByUnit(@Param('unitId') unitId: string): Promise<Activity[]> {
    return this.activitiesService.findByUnit(unitId)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto): Promise<Activity> {
    return this.activitiesService.update(id, updateActivityDto)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'teacher')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.activitiesService.delete(id)
  }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() submitActivityDto: SubmitActivityDto): Promise<{ activityId: string; userId: string; status: string }> {
    return this.activitiesService.submitActivity(id, submitActivityDto)
  }
}
