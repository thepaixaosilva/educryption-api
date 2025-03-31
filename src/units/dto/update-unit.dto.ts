import { PartialType } from '@nestjs/mapped-types'
import { CreateUnitDto } from './create-unit.dto'
import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiPropertyOptional({ description: 'The title of the unit.', example: 'DES Encryption' })
  @IsString()
  @IsOptional()
  title?: string
}
