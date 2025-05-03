import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from './schemas/unit.schema';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Validators } from 'src/utils/helpers/validators.helper';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { NullableType } from 'src/utils/types/nullable-type';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  private async findUnitById(id: string): Promise<Unit> {
    const unit = await this.unitModel.findById(id).exec();
    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      });
    }
    return unit;
  }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const createdUnit = new this.unitModel(createUnitDto);
    return createdUnit.save();
  }

  async findAll(): Promise<Unit[]> {
    const units = await this.unitModel.find().exec();
    if (units.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noUnitFound',
        },
      });
    }
    return units;
  }

  async findById(id: string): Promise<Unit> {
    Validators.validateId(id, 'Unit');
    return this.findUnitById(id);
  }

  async update(
    id: string,
    updateUnitDto: UpdateUnitDto,
  ): Promise<NullableType<Unit>> {
    Validators.validateId(id, 'Unit');
    const unit = await this.findUnitById(id);
    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      });
    }

    const updatedUnit = await this.unitModel.findByIdAndUpdate(
      id,
      { $set: updateUnitDto },
      { new: true },
    );

    return updatedUnit;
  }

  remove(id: string): Promise<NullableType<Unit>> {
    Validators.validateId(id, 'Unit');
    return this.unitModel.findByIdAndDelete(id).exec();
  }

  private async addReferenceToUnit(
    unitId: string,
    referenceId: string,
  ): Promise<Unit> {
    Validators.validateId(unitId, 'Unit');
    Validators.validateId(referenceId, 'Content');

    const unit = await this.unitModel
      .findByIdAndUpdate(unitId, { new: true })
      .exec();

    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      });
    }

    return unit;
  }

  async addContent(unitId: string, referenceId: string): Promise<Unit> {
    return this.addReferenceToUnit(unitId, referenceId);
  }
}
