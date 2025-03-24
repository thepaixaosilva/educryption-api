import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Activity } from 'src/activities/schemas/activity.schema'
import { Content } from 'src/contents/schemas/content.schema'

export type UnitDocument = HydratedDocument<Unit>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true, // This enables the virtual id getter
})
export class Unit {
  @Prop()
  title: string

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  activities: Activity[]

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }])
  contents: Content[]
}

export const UnitSchema = SchemaFactory.createForClass(Unit)
