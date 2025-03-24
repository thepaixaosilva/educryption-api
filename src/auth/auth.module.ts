import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET, // Make sure you set these values in your .env file
      signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN }, // Define expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard, AuthService], // Export AuthGuard and AuthService if other modules need them
})
export class AuthModule {}
