import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { HookedForm, useFormConnect, useField } from '../../src';

let renders = 0;
const StringField = React.memo(() => {
  const [, { error }] = useField('name')
  renders +=1;
  return <p>{error}</p>;
})

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return <StringField />
  }

  return {
    getProps: () => injectedProps,
    ...render(<HookedForm onSubmit={() => null} {...HookedFormOptions}><TestHookedForm {...props} /></HookedForm>),
  };
};

describe('ErorrMessage', () => {
  afterEach(() => {
    renders = 0;
    cleanup();
  });

  describe('perHookedFormance', () => {
    it('should not rerender when props change or parent rerenders', () => {
      const { getProps } = makeHookedForm({ initialValues: { name: 'j' } });
      const { setFieldValue } = getProps();

      expect(renders).toBe(1);
      act(() => {
        setFieldValue('name', 'j');
      });
      expect(renders).toBe(1);
      act(() => {
        setFieldValue('name', 'jovi');
      });
      expect(renders).toBe(2);
    })
  });
});
