import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { RoleSchema } from '../../roles/entities/role.entity'
import { StatusSchema } from '../../statuses/entities/status.entity'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { Unit } from '../../units/schemas/unit.schema'
import { Activity } from '../../activities/schemas/activity.schema'
import { Comment } from '../../comments/schemas/comment.schema'

export type UserDocument = HydratedDocument<User>

@Schema()
export class UserActivity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' })
  activity_id: Activity

  @Prop()
  status: string
}

@Schema()
export class UserUnit {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit: Unit

  @Prop()
  status: string
}

@ApiTags('Users')
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
  id: true, // This enables the virtual id getter
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
  fullName: string

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

  @Prop([UserActivity])
  activities: UserActivity[]

  @Prop([UserUnit])
  units: UserUnit[]

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ 'role._id': 1 })
