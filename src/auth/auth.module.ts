import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthGuard],
})
export class AuthModule { }
