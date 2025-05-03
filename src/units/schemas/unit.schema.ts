import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export type UnitDocument = HydratedDocument<Unit>;

@ApiTags('Units')
@Schema({ timestamps: true })
export class Unit {
  @ApiProperty({ description: 'Title of the unit' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Key to unlock the unit' })
  @Prop({ required: true })
  unlock_key: string;

  @ApiProperty({
    type: [String],
    description: 'Array of content ObjectIds associated with the unit',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Content', default: [] })
  contents: Types.ObjectId[];
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
