import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Unit } from '../../units/schemas/unit.schema'
import { ApiProperty, ApiTags } from '@nestjs/swagger'

export type ActivityDocument = HydratedDocument<Activity>

@ApiTags('Activities')
@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true,
})
export class Activity {
  @ApiProperty({
    type: String,
    example: 'Diffie-Hellmann: Generating a Key',
    description: 'The title of the activity',
    required: true,
  })
  @Prop()
  title: string

  @ApiProperty({
    type: String,
    example: '60c72b2f5b8f9c001f9f1a23',
    description: 'ID of the correspondent unit',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit_id: Unit
}

export const ActivitySchema = SchemaFactory.createForClass(Activity)
