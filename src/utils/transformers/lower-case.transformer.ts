import { TransformFnParams } from 'class-transformer';
import { MaybeType } from '../types/maybe.type';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  if (typeof params.value === 'string') {
    return params.value.toLowerCase().trim();
  }
  return params.value;
};
