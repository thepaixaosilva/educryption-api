import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator'

export class CreateContentDto {
  @ApiProperty({
    description: 'The title of the content',
    example: 'First Phase: Permutation'
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    description: 'File URI that corresponds to the file path for the content',
    example: 'file:///C:/Users/username/Documents/content-file.pdf'
  })
  @IsString()
  @IsOptional()
  file?: string

  @ApiProperty({
    description: 'ID of correspondent unit',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId()
  @IsNotEmpty()
  unit_id: string
}
