import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
