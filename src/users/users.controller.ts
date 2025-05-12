import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Roles(RoleEnum.ADMIN)
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new user',
    description: 'Creates a new user with the provided data.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  create(
    @Body() createProfileDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createProfileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: 404,
    description: 'No user found',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiOperation({
    summary: 'Update user',
    description: "Updates a user's information by their ID.",
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to update',
    type: String,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Updated user data',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID to delete',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove user',
    description: 'Removes a user from the system by their ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'User removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Post(':userId/units/:unitId/unlock')
  @ApiOperation({
    summary: 'Unlock a unit for a user',
    description: 'Unlocks a specific unit for the user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiParam({
    name: 'unitId',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit unlocked successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or unit already unlocked.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or unit not found.',
  })
  unlockUnit(
    @Param('userId') userId: string,
    @Param('unitId') unitId: string,
  ): Promise<void> {
    return this.usersService.unlockUnit(userId, unitId);
  }

  @Post(':userId/units/:unitId/complete')
  @ApiOperation({
    summary: 'Complete a unit for a user',
    description: 'Marks a unit as completed for the user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiParam({
    name: 'unitId',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit marked as completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or unit not unlocked.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or unit not found.',
  })
  completeUnit(
    @Param('userId') userId: string,
    @Param('unitId') unitId: string,
  ): Promise<void> {
    return this.usersService.completeUnit(userId, unitId);
  }

  @Post(':userId/units/:unitId/contents/:contentId/mark-read')
  @ApiOperation({
    summary: 'Mark content as read for a user',
    description: 'Marks a specific content as read for the user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiParam({
    name: 'unitId',
    description: 'Unit ID',
    type: String,
  })
  @ApiParam({
    name: 'contentId',
    description: 'Content ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content marked as read successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or unit not unlocked.',
  })
  @ApiResponse({
    status: 404,
    description: 'User, unit, or content not found.',
  })
  @ApiResponse({
    status: 422,
    description: 'Content does not belong to the specified unit.',
  })
  markContentAsRead(
    @Param('userId') userId: string,
    @Param('unitId') unitId: string,
    @Param('contentId') contentId: string,
  ): Promise<void> {
    return this.usersService.markContentAsRead(userId, unitId, contentId);
  }

  @Post(':userId/units/:unitId/activities/:activityId/complete')
  @ApiOperation({
    summary: 'Complete activity for a user',
    description: 'Marks an activity as completed for a user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiParam({
    name: 'unitId',
    description: 'Unit ID',
    type: String,
  })
  @ApiParam({
    name: 'activityId',
    description: 'Activity ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity marked as completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or unit not unlocked.',
  })
  @ApiResponse({
    status: 404,
    description: 'User, unit, or activity not found.',
  })
  completeActivity(
    @Param('userId') userId: string,
    @Param('unitId') unitId: string,
    @Param('activityId') activityId: string,
  ): Promise<void> {
    return this.usersService.completeActivity(userId, unitId, activityId);
  }
}
