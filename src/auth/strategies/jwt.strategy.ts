import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AllConfigType } from '../../config/config.type'
import { OrNeverType } from '../../utils/types/or-never-type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
    })
  }

  public validate(payload: any): OrNeverType<any> {
    if (!payload.id) {
      throw new UnauthorizedException()
    }

    return payload
  }
}
