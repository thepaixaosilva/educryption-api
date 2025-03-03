import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsEmail, IsOptional, IsString, IsStrongPassword, Matches } from 'class-validator'
import { Type } from 'class-transformer'
import { RoleDto } from 'src/roles/dto/role.dto'
import { StatusDto } from 'src/statuses/dto/status.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: '', example: '' })
  @IsString()
  @IsOptional()
  @IsStrongPassword({ minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 1 }, { message: 'Weak Password' })
  password?: string

  @ApiPropertyOptional({ description: '', example: '' })
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid e-mail.' })
  email?: string

  @ApiPropertyOptional({ description: '', example: '' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÀ-ÿ\s]*$/, { message: 'The name should only contain letters.' })
  firstName?: string

  @ApiPropertyOptional({ description: '', example: '' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÀ-ÿ\s]*$/, { message: 'The name should only contain letters.' })
  lastName?: string

  @ApiPropertyOptional({ description: '', example: '' })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto

  @ApiPropertyOptional({ description: '', example: '' })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto
}
