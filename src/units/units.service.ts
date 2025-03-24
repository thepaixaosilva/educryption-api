import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Unit, UnitDocument } from './schemas/unit.schema'
import { CreateUnitDto } from './dto/create-unit.dto'

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

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

  private async findUnitById(id: string): Promise<Unit> {
    const unit = await this.unitModel.findById(id).exec()
    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      })
    }
    return unit
  }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const createdUnit = new this.unitModel(createUnitDto)
    return createdUnit.save()
  }

  async findAll(): Promise<Unit[]> {
    const units = await this.unitModel.find().exec()
    if (units.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noUnitFound',
        },
      })
    }
    return units
  }

  async findById(id: string): Promise<Unit> {
    await this.validateId(id, 'Unit')
    return this.findUnitById(id)
  }

  private async addReferenceToUnit(unitId: string, referenceId: string, field: string): Promise<Unit> {
    await this.validateId(unitId, 'Unit')
    await this.validateId(referenceId, field.charAt(0).toUpperCase() + field.slice(1))

    const unit = await this.unitModel.findByIdAndUpdate(unitId, { $push: { [field]: referenceId } }, { new: true }).exec()

    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      })
    }

    return unit
  }

  async addActivity(unitId: string, activityId: string): Promise<Unit> {
    return this.addReferenceToUnit(unitId, activityId, 'activities')
  }

  async addContent(unitId: string, contentId: string): Promise<Unit> {
    return this.addReferenceToUnit(unitId, contentId, 'contents')
  }
}
