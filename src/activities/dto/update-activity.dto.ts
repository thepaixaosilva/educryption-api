import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString } from 'class-validator'
import { CreateActivityDto } from './create-activity.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @ApiPropertyOptional({
    description: 'The title of the activity',
    example: 'Diffie-Hellmann: Generating a Key',
  })
  @IsString()
  @IsOptional()
  title?: string
}
