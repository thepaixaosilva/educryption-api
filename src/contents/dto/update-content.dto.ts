import { IsString, IsOptional, IsMongoId } from 'class-validator'
import { CreateContentDto } from './create-content.dto'
import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @ApiPropertyOptional({
    description: 'The title of the content',
    example: 'First Phase: Permutation',
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({
    description: 'File URI that corresponds to the file path for the content',
    example: 'file:///C:/Users/username/Documents/content-file.pdf',
  })
  @IsString()
  @IsOptional()
  file?: string

  @ApiPropertyOptional({
    description: 'ID of correspondent unit',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  @IsOptional()
  unit_id?: string
}
