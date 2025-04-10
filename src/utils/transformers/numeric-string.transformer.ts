import { TransformFnParams } from 'class-transformer';
import { MaybeType } from '../types/maybe.type';

export const numericStringTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  if (typeof params.value === 'string' && !isNaN(Number(params.value))) {
    return params.value;
  }
  throw new Error('Value must be a numeric string.');
};
