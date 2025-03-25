import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { RoleSchema } from '../../roles/entities/role.entity'
import { StatusSchema } from '../../statuses/entities/status.entity'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { Unit } from '../../units/schemas/unit.schema'
import { Activity } from '../../activities/schemas/activity.schema'
import { Comment } from '../../comments/schemas/comment.schema'

export type UserDocument = HydratedDocument<User>

@ApiTags('UserActivities')
@Schema()
export class UserActivity {
  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the activity done by the user',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' })
  activity_id: Activity

  @ApiProperty({
    type: String,
    example: 'completed',
    description: 'The status of the activity',
    required: true,
  })
  @Prop()
  status: string
}

@ApiTags('UserUnits')
@Schema()
export class UserUnit {
  @ApiProperty({
    type: String,
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the unit done by the user',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unit: Unit

  @ApiProperty({
    type: String,
    example: 'completed',
    description: 'The status of the unit',
    required: true,
  })
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
  id: true,
})
export class User {
  @ApiProperty({
    type: String,
    example: 'user@domain.com',
    description: 'User e-mail',
    uniqueItems: true,
    required: true,
  })
  @Prop({
    type: String,
    unique: true,
  })
  email: string

  @ApiProperty({
    type: String,
    description: 'Encrypted user password',
    required: true,
  })
  @Prop({
    type: String,
  })
  password: string

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: "User's full name",
    required: true,
  })
  @Prop({
    type: String,
  })
  fullName: string

  @Prop({
    type: RoleSchema,
  })
  role: RoleSchema

  @Prop({
    type: StatusSchema,
  })
  status: StatusSchema

  @ApiProperty({
    type: [UserActivity],
    example: [
      {
        unit: '60d21b4667d0d8992e610c85',
        status: 'completed',
      },
      {
        unit: '60d21b4667d0d8992e610c86',
        status: 'in-progress',
      },
    ],
    description: 'Array containing the activities done by the user',
    required: false,
  })
  @Prop([UserActivity])
  activities: UserActivity[]

  @ApiProperty({
    type: [UserUnit],
    example: [
      {
        unit: '60d21b4667d0d8992e610c85',
        status: 'completed',
      },
      {
        unit: '60d21b4667d0d8992e610c86',
        status: 'in-progress',
      },
    ],
    description: 'Array containing the units done by the user',
    required: false,
  })
  @Prop([UserUnit])
  units: UserUnit[]

  @ApiProperty({
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    description: 'Array containing the comments written by the user',
    required: false,
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ 'role._id': 1 })
