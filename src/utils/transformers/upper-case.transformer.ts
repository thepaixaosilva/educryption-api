import { TransformFnParams } from 'class-transformer';
import { MaybeType } from '../types/maybe.type';

export const upperCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  if (typeof params.value === 'string') {
    return params.value.toUpperCase().trim();
  }
  return params.value;
};
