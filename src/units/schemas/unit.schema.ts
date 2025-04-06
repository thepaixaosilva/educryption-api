import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'
import { Activity } from '../../activities/schemas/activity.schema'
import { Content } from '../../contents/schemas/content.schema'

export type UnitDocument = HydratedDocument<Unit>

@ApiTags('Units')
@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true,
})
export class Unit {
  @ApiProperty({
    type: String,
    example: 'DES Encryption',
    description: 'Title of the unit',
    required: true,
  })
  @Prop()
  title: string

  @ApiProperty({
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    description: 'Array containing the activities that belongs to the unit',
    required: false,
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  activities: Activity[]

  @ApiProperty({
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    description: 'Array containing the contents that belongs to the unit',
    required: false,
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }])
  contents: Content[]
}

export const UnitSchema = SchemaFactory.createForClass(Unit)
