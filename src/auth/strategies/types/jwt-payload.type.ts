import { User } from '../../../users/schemas/user.schema'

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  iat: number
  exp: number
}
