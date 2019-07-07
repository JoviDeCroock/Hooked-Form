import * as React from 'react';
import { useContextSelector } from 'use-context-selector';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import { FormHookContext } from './types';

export interface FieldInformation {
  error: string;
}

export default function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to  function correctly.');
  }
  return useContextSelector(
    formContext, ({ errors }: FormHookContext) => get(errors, fieldId));
}
