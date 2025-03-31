import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty } from 'class-validator'

export class SubmitActivityDto {
  @ApiProperty({ description: '', example: '60c72b2f5b8f9c001f9f1a23' })
  @IsMongoId()
  @IsNotEmpty()
  user_id: string
}
