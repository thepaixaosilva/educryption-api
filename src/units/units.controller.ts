import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './schemas/unit.schema';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Unit,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new unit',
    description: 'Creates a new unit with the provided data.',
  })
  @ApiBody({
    type: CreateUnitDto,
    description: 'Unit data transfer object',
  })
  @ApiResponse({
    status: 201,
    description: 'Unit created successfully',
    type: Unit,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all units',
    description: 'Retrieves a list of all units with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all units retrieved successfully',
    type: [Unit],
  })
  @ApiResponse({
    status: 404,
    description: 'No units found',
  })
  findAll(): Promise<Unit[]> {
    return this.unitsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Unit,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get unit by ID',
    description: 'Retrieves a specific unit by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit found',
    type: Unit,
  })
  @ApiResponse({
    status: 404,
    description: 'Unit not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid unit ID',
  })
  findOne(@Param('id') id: string): Promise<Unit> {
    return this.unitsService.findById(id);
  }

  @Post(':id/activities/:activityId')
  @ApiCreatedResponse({
    type: Unit,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add an activity to the unit',
    description:
      'Adds an activity to the unit by associating the activity ID to the unit.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unit ID',
  })
  @ApiParam({
    name: 'activityId',
    type: String,
    description: 'Activity ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity added to the unit successfully',
    type: Unit,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  addActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
  ): Promise<Unit> {
    return this.unitsService.addActivity(id, activityId);
  }

  @Post(':id/contents/:contentId')
  @ApiCreatedResponse({
    type: Unit,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add content to the unit',
    description:
      'Adds a content to the unit by associating the content ID to the unit.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unit ID',
  })
  @ApiParam({
    name: 'contentId',
    type: String,
    description: 'Content ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Content added to the unit successfully',
    type: Unit,
  })
  @ApiResponse({
    status: 422,
    description: 'Data failed validation',
  })
  addContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ): Promise<Unit> {
    return this.unitsService.addContent(id, contentId);
  }
}
