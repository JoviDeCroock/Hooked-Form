import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { HookedForm, useFormConnect } from '../../src';
import { FieldArray } from '../_utils';

let renders = 0;
const Array = ({ error }: { error: string }) => {
  renders +=1;
  return <p>hi</p>;
}

const Component = () => <FieldArray fieldId="friends" component={Array} />;

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return <Component />
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
      const { getProps, getByTestId, rerender, ...rest } =
        makeHookedForm({ initialValues: { friends: [] } });

      const { setFieldValue } = getProps();
      expect(renders).toBe(1);
      act(() => {
        setFieldValue('name', 'j');
      });
      expect(renders).toBe(1);
      act(() => {
        setFieldValue('friends', ['x']);
      });
      expect(renders).toBe(2);
    })
  });
});
