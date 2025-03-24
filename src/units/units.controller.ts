import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { UnitsService } from './units.service'
import { CreateUnitDto } from './dto/create-unit.dto'
import { Unit } from './schemas/unit.schema'

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitsService.create(createUnitDto)
  }

  @Get()
  findAll(): Promise<Unit[]> {
    return this.unitsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Unit> {
    return this.unitsService.findById(id)
  }

  @Post(':id/activities/:activityId')
  addActivity(@Param('id') id: string, @Param('activityId') activityId: string): Promise<Unit> {
    return this.unitsService.addActivity(id, activityId)
  }

  @Post(':id/contents/:contentId')
  addContent(@Param('id') id: string, @Param('contentId') contentId: string): Promise<Unit> {
    return this.unitsService.addContent(id, contentId)
  }
}
