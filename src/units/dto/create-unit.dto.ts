import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({
    description: 'Title of the unit',
    example: 'DES: Data Encryption Standard',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Key to unlock the unit' })
  @IsString()
  unlock_key: string;

  @ApiProperty({
    description: 'Array of content ObjectIds associated with the unit',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  contents?: string[];
}
