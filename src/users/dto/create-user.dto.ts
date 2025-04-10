import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '', example: '' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÀ-ÿ\s]*$/, {
    message: 'The name should only contain letters.',
  })
  fullName: string;

  @ApiProperty({ description: '', example: '' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    { message: 'Weak Password' },
  )
  password: string;

  @ApiProperty({ description: '', example: '' })
  @IsString()
  @IsEmail({}, { message: 'Invalid e-mail.' })
  email: string;

  @ApiProperty({ description: '', example: '' })
  @Type(() => RoleDto)
  role: RoleDto;

  @ApiProperty({ description: '', example: '' })
  @Type(() => StatusDto)
  status: StatusDto;
}
