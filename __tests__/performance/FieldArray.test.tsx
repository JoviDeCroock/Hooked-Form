import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { Form, FieldArray, useFormConnect } from '../../src';

let renders = 0;
const Array = ({ error }: { error: string }) => {
  renders +=1;
  return <p>hi</p>;
}

const Component = () => <FieldArray fieldId="friends" component={Array} />;

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = () => {
    injectedProps = useFormConnect();
    return <Component />
  }
  return {
    getProps: () => injectedProps,
    ...render(<Form onSubmit={() => null} {...formOptions}><TestForm {...props} /></Form>),
  };
};

describe('ErorrMessage', () => {
  afterEach(() => {
    renders = 0;
    cleanup();
  });

  describe('performance', () => {
    it('should not rerender when props change or parent rerenders', () => {
      const { getProps, getByTestId, rerender, ...rest } =
        makeForm({ initialValues: { friends: [] } });

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
