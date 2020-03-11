import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { HookedForm, useFormConnect, useField } from '../../src';

let events: string[] = [];
const StringField = React.memo(({ name }: { name: string }) => {
  const [, { error }] = useField(name);
  events.push(`render ${name}`);
  return <p>{error}</p>;
});

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return (
      <div>
        <StringField name="name" />
        <StringField name="address" />
      </div>
    );
  };

  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm onSubmit={console.log} {...HookedFormOptions}>
        <TestHookedForm {...props} />
      </HookedForm>
    ),
  };
};

describe('ErorrMessage', () => {
  const initialValues = {
    name: 'HookedForm',
    family: 'family',
    friends: [{ id: '1a', name: 'someone' }],
  };

  afterEach(() => {
    events = [];
    cleanup();
  });

  describe('HookedFieldPerformance', () => {
    it('should not rerender when props change or parent rerenders', () => {
      const { getProps } = makeHookedForm({ initialValues });
      const { setFieldValue } = getProps();

      expect(events).toHaveLength(2);
      act(() => {
        setFieldValue('age', '2');
      });

      expect(events).toHaveLength(2);
      act(() => {
        setFieldValue('name', 'jovi');
      });
      expect(events).toHaveLength(3);
    });

    it('validation', () => {
      const { getProps } = makeHookedForm({
        initialValues: { name: 'j' },
        validate: () => ({}),
      });
      const { setFieldValue } = getProps();

      expect(events).toHaveLength(2);
      act(() => {
        setFieldValue('age', '2');
      });

      expect(events).toHaveLength(2);
      act(() => {
        setFieldValue('name', 'jovi');
      });
      expect(events).toHaveLength(3);
    });
  });
});
