import * as React from 'react';
import { useContextSelector } from 'use-context-selector';
import { formContext } from './helpers/context';
import { FormHookContext } from './types';

export default (): FormHookContext => useContextSelector(formContext, form => form);
