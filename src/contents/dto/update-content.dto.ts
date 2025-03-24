import { IsString, IsOptional, IsMongoId } from 'class-validator'

export class UpdateContentDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  file?: string

  @IsMongoId()
  @IsOptional()
  unit_id?: string
}
