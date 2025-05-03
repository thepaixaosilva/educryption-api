import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Delete,
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
import { UpdateUnitDto } from './dto/update-unit.dto';
import { NullableType } from 'src/utils/types/nullable-type';

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

  @Patch(':id')
  @ApiOkResponse({
    type: Unit,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update unit by ID',
    description: 'Updates a specific unit by its ID with the provided data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit updated successfully',
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
  @ApiBody({
    type: CreateUnitDto,
    description: 'Updated unit data',
  })
  update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<NullableType<Unit>> {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete unit by ID',
    description: 'Deletes a specific unit by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unit ID',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Unit deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Unit not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid unit ID',
  })
  remove(@Param('id') id: string): Promise<NullableType<Unit>> {
    return this.unitsService.remove(id);
  }
}
