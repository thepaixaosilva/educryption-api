import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoId()
  @IsOptional()
  unit_id?: string
}
