import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export type ContentDocument = HydratedDocument<Content>;

@ApiTags('Contents')
@Schema({ timestamps: true })
export class Content {
  @ApiProperty({
    type: String,
    example: 'First Function: Expansion',
    description: 'Title of the content',
    required: true,
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    type: String,
    example:
      'This activity is about the expansion of the data to be encrypted.',
    description: 'Description of the content',
    required: true,
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Display sequence position of the content',
    required: true,
  })
  @Prop({ required: true })
  sequence: number;

  @ApiProperty({
    type: String,
    example: 'practice',
    enum: ['practice', 'text'],
    description: 'Type of the content',
    required: true,
  })
  @Prop({ required: true, enum: ['practice', 'text'] })
  type: 'practice' | 'text';

  @ApiProperty({
    type: String,
    description: 'Reference to the unit this content belongs to',
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: 'Unit', required: true })
  unit_id: Types.ObjectId;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
