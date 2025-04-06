import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../users/schemas/user.schema'
export class LoginResponseDto {
  @ApiProperty()
  token: string

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  tokenExpires: number

  @ApiProperty({
    type: () => User,
  })
  user: User
}
