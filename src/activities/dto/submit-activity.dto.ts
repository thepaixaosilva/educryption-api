import { IsMongoId, IsNotEmpty } from 'class-validator'

export class SubmitActivityDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string
}
