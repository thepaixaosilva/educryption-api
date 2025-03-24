import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Unit } from '../../units/schemas/unit.schema'

export type ActivityDocument = HydratedDocument<Activity>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true, // This enables the virtual id getter
})
export class Activity {
  @Prop()
  title: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit_id: Unit
}

export const ActivitySchema = SchemaFactory.createForClass(Activity)
