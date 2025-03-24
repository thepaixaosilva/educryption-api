import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator'

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  file?: string

  @IsMongoId()
  @IsNotEmpty()
  unit_id: string
}
