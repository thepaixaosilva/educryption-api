import { HttpStatus, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import * as ms from 'ms'
import { User } from '../users/schemas/user.schema'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from '../config/config.type'
import { AuthLoginDto } from './dto/auth-login.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { NullableType } from '../utils/types/nullable-type'
import { JwtPayloadType } from './strategies/types/jwt-payload.type'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService<AllConfigType>
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email)

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      })
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      })
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      })
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
    })

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    }
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findById(userJwtPayload.id)
  }

  async refreshToken(payload: { id: string; role: string }): Promise<Omit<LoginResponseDto, 'user'>> {
    const user = await this.usersService.findById(payload.id)

    if (!user?.role) throw new UnauthorizedException()

    const {
      token,
      refreshToken: newRefreshToken,
      tokenExpires,
    } = await this.getTokensData({
      id: user.id,
      role: user.role,
    })

    return {
      token,
      refreshToken: newRefreshToken,
      tokenExpires,
    }
  }

  private async getTokensData(data: { id: User['id']; role: User['role'] }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    })

    const tokenExpires = Date.now() + ms(tokenExpiresIn)

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        }
      ),
      this.jwtService.signAsync(
        {
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        }
      ),
    ])

    return {
      token,
      refreshToken,
      tokenExpires,
    }
  }
}
