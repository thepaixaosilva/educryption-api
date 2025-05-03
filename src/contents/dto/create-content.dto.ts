import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: 'Title of the content',
    example: 'First Function: Expansion',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the content',
    example:
      'This activity is about the expansion of the data to be encrypted.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Display sequence position of the content',
    example: 1,
  })
  @IsInt()
  sequence: number;

  @ApiProperty({
    description: 'Type of the content',
    example: 'practice',
    enum: ['practice', 'text'],
  })
  @IsEnum(['practice', 'text'])
  @IsNotEmpty()
  type: 'practice' | 'text';

  @ApiProperty({ description: 'Reference to the unit this content belongs to' })
  @IsMongoId()
  @IsNotEmpty()
  unit_id: string;
}
