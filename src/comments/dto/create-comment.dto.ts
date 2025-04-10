import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text of the comment',
    example:
      'I did not understand the content. Can someone break it down for me, please?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Author ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiPropertyOptional({
    description: 'ID of the correspondent content',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  @IsOptional()
  content_id?: string;

  @ApiPropertyOptional({
    description: 'ID of the correspondent comment',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  @IsOptional()
  comment_id?: string;
}
