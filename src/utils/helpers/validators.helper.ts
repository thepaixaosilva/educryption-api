import { BadRequestException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';

export class Validators {
  static async validateId(id: string, type: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(
        new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            status: `invalid${type}Id`,
          },
        }),
      );
    }
  }
}
