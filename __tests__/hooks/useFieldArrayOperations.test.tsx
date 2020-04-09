import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import { HookedForm, useFormConnect, useFieldArray, useField } from '../../src';

const StringField = ({ fieldId }: { fieldId: string }) => {
  const [{ onChange, onBlur }, { error, value }] = useField(fieldId, v =>
    v.length > 2 ? 'err' : undefined
  );
  return (
    <React.Fragment>
      <input
        data-testid={fieldId}
        onBlur={onBlur}
        onChange={(e: any) => onChange(e.target.value)}
        value={value}
      />
      <p data-testid={`${fieldId}-error`}>{error}</p>
    </React.Fragment>
  );
};

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    const fieldId = 'friends';
    const [
      { add, remove, swap, insert, move, replace },
      { value },
    ] = useFieldArray(fieldId);
    injectedProps = { ...useFormConnect(), value };
    return (
      <React.Fragment>
        {value.map((val: object, i: number) => (
          <React.Fragment key={fieldId + i}>
            <StringField fieldId={`${fieldId}[${i}].name`} />
            <button
              data-testid={`remove-element-${i}`}
              onClick={() => remove(i)}
            >
              Delete
            </button>
          </React.Fragment>
        ))}
        <button
          data-testid="add-element"
          onClick={() => add({ name: `${value.length}` })}
        >
          Add
        </button>
        <button
          data-testid="insert-element"
          onClick={() => insert(1, { name: `${value.length}` })}
        >
          Insert
        </button>
        <button data-testid="swap-element" onClick={() => swap(0, 1)}>
          Swap
        </button>
        <button data-testid="move-element" onClick={() => move(0, 1)}>
          Move
        </button>
        <button
          data-testid="replace-element"
          onClick={() => replace(1, { name: `hi` })}
        >
          Move
        </button>
      </React.Fragment>
    );
  };

  const initialValues = {
    friends: [{ name: 'K' }, { name: 'J' }],
    hobby: { id: 1, name: 'badass' },
  };

  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm
        initialValues={initialValues}
        onSubmit={() => null}
        {...HookedFormOptions}
      >
        <TestHookedForm {...props} />
      </HookedForm>
    ),
  };
};

describe('FieldArrayWithErrors', () => {
  afterEach(() => cleanup());

  it('Should swap fields (values, errors, touched)', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const swapButton = getByTestId('swap-element');
    const firstFriendField = getByTestId('friends[0].name');
    await act(async () => {
      await fireEvent.click(swapButton);
    });
    let { values, errors } = getProps();
    expect(values.friends).toHaveLength(2);
    expect(values.friends[0].name).toEqual('J');
    expect(values.friends[1].name).toEqual('K');

    await act(async () => {
      await fireEvent.change(firstFriendField, { target: { value: 'JJJ' } });
    });
    await act(async () => {
      await fireEvent.blur(firstFriendField);
    });
    ({ values, errors } = getProps());
    expect(values.friends[0].name).toEqual('JJJ');
    expect(errors.friends[0].name).toEqual('err');
    expect(values.friends[1].name).toEqual('K');
    expect(errors.friends[1]).toBeUndefined();

    await act(async () => {
      await fireEvent.click(swapButton);
    });
    ({ values, errors } = getProps());
    expect(values.friends).toHaveLength(2);
    expect(values.friends[1].name).toEqual('JJJ');
    expect(errors.friends[1]).toBeDefined();
    expect(errors.friends[1].name).toEqual('err');
    expect(values.friends[0].name).toEqual('K');
    expect(errors.friends[0]).toBeUndefined();
  });

  it('Should insert fields (values, errors, touched)', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const insertButton = getByTestId('insert-element');
    const firstFriendField = getByTestId('friends[0].name');

    await act(async () => {
      await fireEvent.change(firstFriendField, { target: { value: 'JJJ' } });
    });
    await act(async () => {
      await fireEvent.blur(firstFriendField);
    });

    let { values, errors } = getProps();
    expect(values.friends[0].name).toEqual('JJJ');
    expect(errors.friends[0].name).toEqual('err');
    expect(values.friends[1].name).toEqual('J');
    expect(errors.friends[1]).toBeUndefined();

    await act(async () => {
      await fireEvent.click(insertButton);
    });
    ({ values, errors } = getProps());
    expect(values.friends).toHaveLength(3);
    expect(values.friends[0].name).toEqual('JJJ');
    expect(errors.friends[0]).toBeDefined();
    expect(errors.friends[0].name).toEqual('err');
    expect(values.friends[1].name).toEqual('2');
    expect(errors.friends[1]).toBeUndefined();
    expect(values.friends[2].name).toEqual('J');
    expect(errors.friends[2]).toBeUndefined();
  });
});
