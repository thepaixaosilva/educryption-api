import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, SerializeOptions, UseGuards } from '@nestjs/common'
import { ActivitiesService } from './activities.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'
import { SubmitActivityDto } from './dto/submit-activity.dto'
import { Activity } from './schemas/activity.schema'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Activiities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new activity',
    description: 'Creates a new activity with the provided data.',
  })
  @ApiBody({
    type: CreateActivityDto,
    description: 'Activity data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
    type: Activity,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  create(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activitiesService.create(createActivityDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all activities',
    description: 'Retrieves a list of all activities with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all activities retrieved successfully',
    type: [Activity],
  })
  @ApiResponse({
    status: 404,
    description: 'No activities found',
  })
  findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll()
  }

  @Get(':id')
  @ApiOkResponse({
    type: Activity,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get activity by ID',
    description: 'Retrieves a specific activity by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Activity ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity found',
    type: Activity,
  })
  @ApiResponse({
    status: 404,
    description: 'Activity not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid activity ID',
  })
  findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findById(id)
  }

  @Get('unit/:unitId')
  @ApiOkResponse({
    type: Activity,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get activities by unit ID',
    description: 'Retrieves a list of activities associated with a specific unit by its ID.',
  })
  @ApiParam({
    name: 'unitId',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Activities found for the unit',
    type: [Activity],
  })
  @ApiResponse({
    status: 404,
    description: 'No activities found for the unit',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid unit ID',
  })
  findByUnit(@Param('unitId') unitId: string): Promise<Activity[]> {
    return this.activitiesService.findByUnit(unitId)
  }

  @Put(':id')
  @ApiOkResponse({
    type: Activity,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOperation({
    summary: 'Update activity',
    description: "Updates an activity's information by its ID.",
  })
  @ApiParam({
    name: 'id',
    description: 'Activity ID to update',
    type: String,
  })
  @ApiBody({
    type: UpdateActivityDto,
    description: 'Updated activity data',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity updated successfully',
    type: Activity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid activity ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Activity not found',
  })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto): Promise<Activity> {
    return this.activitiesService.update(id, updateActivityDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Activity ID to delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove activity',
    description: 'Removes an activity from the system by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Activity removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid activity ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Activity not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.activitiesService.delete(id)
  }

  @Post(':id/submit')
  @ApiOperation({
    summary: 'Submit activity',
    description: 'Submits a completed activity with the provided data.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Activity ID to submit',
  })
  @ApiBody({
    type: SubmitActivityDto,
    description: 'Submitted activity data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'Activity submitted successfully',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        activityId: { type: 'string' },
        userId: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  submit(@Param('id') id: string, @Body() submitActivityDto: SubmitActivityDto): Promise<{ activityId: string; userId: string; status: string }> {
    return this.activitiesService.submitActivity(id, submitActivityDto)
  }
}
