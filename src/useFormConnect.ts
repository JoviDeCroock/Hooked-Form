import * as React from 'react';
import { formContext } from './helpers/context';
import { FormHookContext } from './types';

export default (): FormHookContext => React.useContext(formContext);
