import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Comment } from '../../comments/schemas/comment.schema'
import { Unit } from '../../units/schemas/unit.schema'

export type ContentDocument = HydratedDocument<Content>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true, // This enables the virtual id getter
})
export class Content {
  @Prop()
  title: string

  @Prop()
  file: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit_id: Unit

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[]
}

export const ContentSchema = SchemaFactory.createForClass(Content)
