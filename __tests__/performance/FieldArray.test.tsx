import * as React from 'react';
import { act, cleanup, render } from 'react-testing-library';

import { Form, FieldArray } from '../../src';

let renders = 0;
const Array = ({ error }: { error: string }) => {
  renders +=1;
  return <p>hi</p>;
}

const Component = () => <FieldArray fieldId="friends" component={Array} />;

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => (injectedProps = formProps) && <Component {...formProps} />);
  return {
    getProps: () => injectedProps,
    ...render(<TestForm {...props} />),
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

      const { change } = getProps();
      expect(renders).toBe(1);
      act(() => {
        change('name', 'j');
      });
      expect(renders).toBe(1);
      act(() => {
        change('friends', ['x']);
      });
      expect(renders).toBe(2);
    })
  });
});
