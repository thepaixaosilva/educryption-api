import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString } from 'class-validator'
import { CreateCommentDto } from './create-comment.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({
    description: 'The text of the comment',
    example: 'I did not understand the content. Can someone break it down for me, please?'
  })
  @IsString()
  @IsOptional()
  text?: string
}
