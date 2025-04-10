import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({
    description: 'The title of the unit.',
    example: 'DES Encryption',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
