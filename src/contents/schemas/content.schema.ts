import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Comment } from '../../comments/schemas/comment.schema';
import { Unit } from '../../units/schemas/unit.schema';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export type ContentDocument = HydratedDocument<Content>;

@ApiTags('Contents')
@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true,
})
export class Content {
  @ApiProperty({
    type: String,
    example: 'First Phase: Permutation',
    description: 'The title of the content',
    required: true,
  })
  @Prop()
  title: string;

  @ApiProperty({
    type: String,
    example: 'file:///C:/Users/username/Documents/content-file.pdf',
    description: 'File URI that corresponds to the file path for the content',
    required: false,
  })
  @Prop()
  file: string;

  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the correspondent unit',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit_id: Unit;

  @ApiProperty({
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    description: 'Array that contain the comments about the content',
    required: false,
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
