import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string

  @IsMongoId()
  @IsNotEmpty()
  user_id: string

  @IsMongoId()
  @IsOptional()
  content_id?: string

  @IsMongoId()
  @IsOptional()
  comment_id?: string // Para respostas a outros comentários
}
