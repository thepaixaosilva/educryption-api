import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Content, ContentDocument } from './schemas/content.schema'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UnitsService } from '../units/units.service'
import { Validators } from 'src/utils/helpers/validators.helper'

@Injectable()
export class ContentsService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    private unitsService: UnitsService
  ) { }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const unit = await this.unitsService.findById(createContentDto.unit_id)
    if (!unit) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'unitNotFound',
        },
      })
    }

    const createdContent = new this.contentModel(createContentDto)
    const savedContent = await createdContent.save()

    await this.unitsService.addContent(createContentDto.unit_id, savedContent._id.toString())

    return savedContent
  }

  async findAll(): Promise<Content[]> {
    const contents = await this.contentModel.find().exec()

    if (contents.length === 0) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'noContentFound',
        },
      })
    }

    return contents
  }

  async findById(id: string): Promise<Content> {
    Validators.validateId(id, 'Content')
    const content = await this.contentModel.findById(id).exec()
    if (!content) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'contentNotFound',
        },
      })
    }
    return content
  }

  async findByUnit(unitId: string): Promise<Content[]> {
    Validators.validateId(unitId, 'Unit')
    return this.contentModel.find({ unit_id: unitId }).exec()
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    Validators.validateId(id, 'Content')
    if (updateContentDto.unit_id) {
      const unit = await this.unitsService.findById(updateContentDto.unit_id)
      if (!unit) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          errors: {
            status: 'unitNotFound',
          },
        })
      }
    }

    const updatedContent = await this.contentModel.findByIdAndUpdate(id, updateContentDto, { new: true }).exec()

    if (!updatedContent) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'contentNotFound',
        },
      })
    }

    return updatedContent
  }

  async remove(id: string): Promise<void> {
    Validators.validateId(id, 'Content')
    const deletedContent = await this.contentModel.findByIdAndDelete(id).exec()
    if (!deletedContent) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'contentNotFound',
        },
      })
    }
  }

  async addComment(contentId: string, commentId: string): Promise<Content> {
    Validators.validateId(contentId, 'Content')
    Validators.validateId(commentId, 'Comment')
    const content = await this.contentModel.findByIdAndUpdate(contentId, { $push: { comments: commentId } }, { new: true }).exec()

    if (!content) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'contentNotFound',
        },
      })
    }

    return content
  }
}
