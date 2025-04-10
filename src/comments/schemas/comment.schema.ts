import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Content } from '../../contents/schemas/content.schema';
import { User } from '../../users/schemas/user.schema';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export type CommentDocument = HydratedDocument<Comment>;

@ApiTags('Comments')
@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true,
})
export class Comment {
  @ApiProperty({
    type: String,
    example:
      'I did not understand the content. Can someone break it down for me, please?',
    description: 'The text of the comment',
    required: true,
  })
  @Prop()
  text: string;

  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'Author ID',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the correspondent content',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Content' })
  content_id: Content;

  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the correspondent comment',
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment_id: Comment;

  @ApiProperty({
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    description: 'Array containing the comments written by the user',
    required: false,
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  references: Comment[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
