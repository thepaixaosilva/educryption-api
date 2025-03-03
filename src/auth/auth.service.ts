import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }

    return null
  }

  async login(user: { email: string; id: string | number }) {
    console.log(user)
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
