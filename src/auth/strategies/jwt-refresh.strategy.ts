import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { OrNeverType } from '../../utils/types/or-never-type';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload?.id || !payload?.role) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
