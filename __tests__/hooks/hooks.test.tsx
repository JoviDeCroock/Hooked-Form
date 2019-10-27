import * as React from 'react';
import { cleanup, render } from '@testing-library/react';

import { useError, useField, useFieldArray, HookedForm } from '../../src';

const App = ({ children }: any) => (
  <HookedForm onSubmit={() => {}}>
    {children}
  </HookedForm>
);

const Component = ({ hook }: { hook: any }) => {
  const error = hook();
  return <p data-testid="error">{error}</p>
}

describe('hooks', () => {
  afterEach(() => {
    cleanup();
  });

  describe('useError', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component hook={useError} /></App>))
        .toThrowError(/The Error needs a valid "fieldId" property to function correctly./);
    });
  });

  describe('useField', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component hook={useField} /></App>))
        .toThrowError(/The Field needs a valid "fieldId" property to function correctly./);
    });
  });

  describe('useFieldArray', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component hook={useFieldArray} /></App>))
        .toThrowError(/The FieldArray needs a valid "fieldId" property to function correctly./);
    });
  });
});
