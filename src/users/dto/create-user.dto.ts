import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  Matches,
  IsMongoId,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from '../enums/statuses.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user to be hashed' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Username (3–30 chars, letters/numbers/underscores/hyphens)',
    example: 'john_doe',
  })
  @Matches(/^[a-zA-Z0-9_-]{3,30}$/)
  @IsString()
  @Length(3, 30)
  username: string;

  @ApiProperty({
    description: 'Full name (optional, 3–100 chars, letters and spaces)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @Matches(/^(?=.{3,100}$)[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]*[A-Za-zÀ-ÿ]$/)
  full_name?: string;

  @ApiProperty({
    description: 'Role of the user (admin, user, etc.)',
    example: 'user',
    enum: RoleEnum,
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiProperty({
    description: 'Status of the user (active, inactive, etc.)',
    example: 'active',
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    description: 'Array of ObjectIds of unlocked units',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  units_unlocked?: string[];

  @ApiProperty({
    description: 'Array of ObjectIds of completed units',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  units_completed?: string[];

  @ApiProperty({
    description: 'Array of ObjectIds of read contents',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  contents_read?: string[];

  @ApiProperty({
    description: 'Array of ObjectIds of completed activities',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  activities_completed?: string[];
}
