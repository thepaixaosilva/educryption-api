import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateActivityDto {
  @ApiProperty({
    description: 'The title of the activity',
    example: 'Diffie-Hellman: Generating a Key',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional({
    description: 'ID of the correspondent unit',
    example: '60c72b2f5b8f9c001f9f1a23',
  })
  @IsMongoId()
  @IsOptional()
  unit_id?: string
}
