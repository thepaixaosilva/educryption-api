import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Content } from '../../contents/schemas/content.schema'
import { User } from '../../users/schemas/user.schema'

export type CommentDocument = HydratedDocument<Comment>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true, // This enables the virtual id getter
})
export class Comment {
  @Prop()
  text: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Content' })
  content_id: Content

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment_id: Comment

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  references: Comment[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
