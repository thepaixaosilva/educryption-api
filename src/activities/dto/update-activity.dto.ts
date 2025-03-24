import { IsOptional, IsString } from 'class-validator'

export class UpdateActivityDto {
  @IsString()
  @IsOptional()
  title?: string
}
