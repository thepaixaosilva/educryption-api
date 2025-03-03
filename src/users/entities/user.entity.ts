import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, now } from 'mongoose'
import { RoleSchema } from '../../roles/entities/role.entity'
import { StatusSchema } from '../../statuses/entities/status.entity'
import { ApiProperty, ApiTags } from '@nestjs/swagger'

export type UserDocument = HydratedDocument<User>

@ApiTags('Users')
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class User {
  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: String,
    unique: true,
  })
  email: string

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: String,
  })
  password: string

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: String,
  })
  firstName: string

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: String,
  })
  lastName: string

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: RoleSchema,
  })
  role: RoleSchema

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({
    type: StatusSchema,
  })
  status: StatusSchema

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({ default: now })
  createdAt: Date

  @ApiProperty({ example: '', description: '', required: true })
  @Prop({ default: now })
  updatedAt: Date

  @ApiProperty({ example: '', description: '', required: true })
  @Prop()
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ 'role._id': 1 })
