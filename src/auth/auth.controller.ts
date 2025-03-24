import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      return { message: 'Inform your credentials to log-in' }
    }

    const user = await this.authService.validateUser(body.email, body.password)

    if (user) {
      return this.authService.login({
        email: user.email,
        id: user._id,
      })
    }

    return { message: 'Invalid credentials' }
  }
}
