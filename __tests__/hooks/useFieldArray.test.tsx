import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import { HookedForm, useFormConnect, useFieldArray, useField } from '../../src';

const StringField = ({ fieldId }: { fieldId: string }) => {
  const [{ onChange, onBlur }, { error, value }] = useField(fieldId)
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
  )
}

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    const fieldId = 'friends';
    const [{ add, remove, swap, insert, move, replace }, { value }] = useFieldArray(fieldId);
    injectedProps = { ...useFormConnect(), value }
    return (
      <React.Fragment>
        {value.map((val: object, i: number) => (
          <React.Fragment key={fieldId + i}>
            <StringField fieldId={`${fieldId}[${i}].name`} />
            <button data-testid={`remove-element-${i}`} onClick={() => remove(i)}>Delete</button>
          </React.Fragment>
        ))}
        <button data-testid="add-element" onClick={() => add({ name: `${value.length}` })}>Add</button>
        <button data-testid="insert-element" onClick={() => insert(1, { name: `${value.length}` })}>Insert</button>
        <button data-testid="swap-element" onClick={() => swap(0, 1)}>Swap</button>
        <button data-testid="move-element" onClick={() => move(0, 1)}>Move</button>
        <button data-testid="replace-element" onClick={() => replace(1, { name: `hi` })}>Move</button>
      </React.Fragment>
    )
  }

  const initialValues = {
    friends: [
      { name: 'K' },
      { name: 'J' },
    ],
    hobby: { id: 1, name: 'badass' },
  }

  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm initialValues={initialValues} onSubmit={() => null} {...HookedFormOptions}>
        <TestHookedForm {...props} />
      </HookedForm>
    ),
  };
};

describe('FieldArray', () => {
  afterEach(() => cleanup());

  it('should render the stringfields and handle onChange aswell as validation', async () => {
    const { getByTestId } = makeHookedForm({
      validate: (values: any) => (values.friends[0].name === 'A') ? { friends: [{ name: 'bad' }] } : {},
      validateOnBlur: true,
      validateOnChange: true,
    });

    const firstFriendField = getByTestId('friends[0].name');
    const secondFriendField = getByTestId('friends[1].name');

    expect((firstFriendField as any).value).toEqual('K');
    expect((secondFriendField as any).value).toEqual('J');
    await act(async () => {
      await fireEvent.change(firstFriendField, { target: { value: 'A' } });
    })

    expect((firstFriendField as any).value).toEqual('A');
    const firstFriendFieldError = getByTestId('friends[0].name-error');
    expect(firstFriendFieldError.textContent).toEqual('bad');
  });

  it('Should add fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const addButton = getByTestId('add-element');
    await act(async () => {
      await fireEvent.click(addButton);
    });
    const { values } = getProps();
    expect(values.friends).toHaveLength(3);
    expect(values.friends[2].name).toEqual('2');
  });

  it('Should swap fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const swapButton = getByTestId('swap-element');
    await act(async () => {
      await fireEvent.click(swapButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(2);
    expect(values.friends[0].name).toEqual('J');
    expect(values.friends[1].name).toEqual('K')

    await act(async () => {
      await fireEvent.click(swapButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(2);
    expect(values.friends[1].name).toEqual('J');
    expect(values.friends[0].name).toEqual('K');
  });

  it('Should insert fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const insertButton = getByTestId('insert-element');
    await act(async () => {
      await fireEvent.click(insertButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(3);
    expect(values.friends[0].name).toEqual('K');
    expect(values.friends[1].name).toEqual('2');
    expect(values.friends[2].name).toEqual('J');
    await act(async () => {
      await fireEvent.click(insertButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(4);
    expect(values.friends[0].name).toEqual('K');
    expect(values.friends[1].name).toEqual('3');
    expect(values.friends[2].name).toEqual('2');
    expect(values.friends[3].name).toEqual('J');
  });

  it('Should move fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const moveButton = getByTestId('move-element');
    await act(async () => {
      await fireEvent.click(moveButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(2);
    expect(values.friends[0].name).toEqual('J');
    expect(values.friends[1].name).toEqual('K')
    await act(async () => {
      await fireEvent.click(moveButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(2);
    expect(values.friends[1].name).toEqual('J');
    expect(values.friends[0].name).toEqual('K');
  });

  it('Should remove fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const removeFirstFieldButton = getByTestId('remove-element-0');
    await act(async () => {
      await fireEvent.click(removeFirstFieldButton);
    });
    const { values } = getProps();
    expect(values.friends).toHaveLength(1);
    expect(values.friends[0].name).toEqual('J')
  });

  it('Should replace fields when asked to', async () => {
    const { getByTestId, getProps } = makeHookedForm();
    const replace = getByTestId('replace-element');
    await act(async () => {
      await fireEvent.click(replace);
    });
    const { values } = getProps();
    expect(values.friends[1].name).toEqual('hi')
  });
});
