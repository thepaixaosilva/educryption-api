import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/roles/roles.enum';

export type UserDocument = HydratedDocument<User>;

@ApiTags('Users')
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true,
})
export class User {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'Unique email address of the user',
    uniqueItems: true,
    required: true,
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Hashed password of the user',
    required: true,
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    type: String,
    example: 'john_doe',
    description: 'Username (3–30 chars, letters/numbers/underscores/hyphens)',
    required: true,
    uniqueItems: true,
  })
  @Prop({ required: true, unique: true, match: /^[a-zA-Z0-9_-]{3,30}$/ })
  username: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Full name (optional, 3–100 chars, letters and spaces)',
    required: false,
  })
  @Prop({
    required: false,
    match: /^(?=.{3,100}$)[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]*[A-Za-zÀ-ÿ]$/,
  })
  full_name?: string;

  @ApiProperty({
    type: String,
    example: 'user',
    description:
      "The user's role must be provided and has to be one of the following: 'admin', 'user'",
    enum: RoleEnum,
    required: true,
  })
  @Prop({ required: true, enum: RoleEnum, default: 'user' })
  role: string;

  @ApiProperty({
    type: String,
    example: 'active',
    description:
      "The user's status must be provided and has to be one of the following: 'active', 'inactive'",
    enum: ['active', 'inactive'],
    required: true,
  })
  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @ApiProperty({
    type: [String],
    description: 'Array of ObjectIds of unlocked units',
    required: false,
  })
  @Prop({ type: [Types.ObjectId], ref: 'Unit', default: [] })
  units_unlocked?: Types.ObjectId[];

  @ApiProperty({
    type: [String],
    description: 'Array of ObjectIds of completed units',
    required: false,
  })
  @Prop({ type: [Types.ObjectId], ref: 'Unit', default: [] })
  units_completed?: Types.ObjectId[];

  @ApiProperty({
    type: [String],
    description: 'Array of ObjectIds of read contents',
    required: false,
  })
  @Prop({ type: [Types.ObjectId], ref: 'Content', default: [] })
  contents_read?: Types.ObjectId[];

  @ApiProperty({
    type: [String],
    description: 'Array of ObjectIds of completed activities',
    required: false,
  })
  @Prop({ type: [Types.ObjectId], ref: 'Content', default: [] })
  activities_completed?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
