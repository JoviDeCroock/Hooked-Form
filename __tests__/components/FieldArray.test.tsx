import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import { HookedForm, useFormConnect } from '../../src';
import { Field, FieldArray } from '../_utils';

const StringField = ({ error, onChange, onBlur, value, id }: { id: string, error?: string, onChange: (value: any) => void, onBlur: () => void, value: any }) => (
  <React.Fragment>
    <input
      data-testid={id}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      value={value}
    />
    <p data-testid={`${id}-error`}>{error}</p>
  </React.Fragment>
)

const Component = ({ fieldId }: { fieldId: string }) => (<Field fieldId={fieldId} component={StringField} id={fieldId} />);

const ArrayContainer = ({ fieldId, add, value, remove, swap, insert, move, replace }:
  {
    add: (input: object) => void,
    fieldId: string,
    value: any,
    remove: (input: object | number) => void,
    swap: (from: number, to: number) => void,
    insert: (at: number, input: object) => void,
    move: (from: number, to: number) => void,
    replace: (at: number, item: object) => void,
  }) => {
  return (
    <React.Fragment>
      {value.map((val: object, i: number) => (
        <React.Fragment key={fieldId + i}>
          <Component fieldId={`${fieldId}[${i}].name`} />
          <button data-testid={`remove-element-${i}`} onClick={() => remove(val)}>Delete</button>
        </React.Fragment>
      ))}
      <button data-testid="add-element" onClick={() => add({ name: `${value.length}` })}>Add</button>
      <button data-testid="insert-element" onClick={() => insert(1, { name: `${value.length}` })}>Insert</button>
      <button data-testid="swap-element" onClick={() => swap(0, 1)}>Swap</button>
      <button data-testid="move-element" onClick={() => move(0, 1)}>Move</button>
      <button data-testid="replace-element" onClick={() => replace(1, { name: `hi` })}>Move</button>
    </React.Fragment>
  );
}

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return (
      <React.Fragment>
        <FieldArray fieldId="friends" component={ArrayContainer} />
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

  it('should render the stringfields and handle onChange aswell as validation', () => {
    const { getByTestId } = makeHookedForm({
      validate: (values: any) => {
        if (values.friends[0].name === 'A') {
          return {
            friends: [
              { name: 'bad' },
            ]
          }
        }
        return {}
      },
      validateOnBlur: true,
      validateOnChange: true,
    });

    const firstFriendField = getByTestId('friends[0].name');
    const secondFriendField = getByTestId('friends[1].name');

    expect((firstFriendField as any).value).toEqual('K');
    expect((secondFriendField as any).value).toEqual('J');
    act(() => {
      fireEvent.change(firstFriendField, { target: { value: 'A' } });
    })

    expect((firstFriendField as any).value).toEqual('A');
    const firstFriendFieldError = getByTestId('friends[0].name-error');
    expect(firstFriendFieldError.textContent).toEqual('bad');
  });

  it('Should add fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    const addButton = getByTestId('add-element');
    act(() => {
      fireEvent.click(addButton);
    });
    const { values } = getProps();
    expect(values.friends).toHaveLength(3);
    expect(values.friends[2].name).toEqual('2');
  });

  it('Should swap fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    let swapButton = getByTestId('swap-element');
    act(() => {
      fireEvent.click(swapButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(2);
    expect(values.friends[0].name).toEqual('J');
    expect(values.friends[1].name).toEqual('K')
    swapButton = getByTestId('swap-element');
    act(() => {
      fireEvent.click(swapButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(2);
    expect(values.friends[1].name).toEqual('J');
    expect(values.friends[0].name).toEqual('K');
  });

  it('Should insert fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    let insertButton = getByTestId('insert-element');
    act(() => {
      fireEvent.click(insertButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(3);
    expect(values.friends[0].name).toEqual('K');
    expect(values.friends[1].name).toEqual('2');
    expect(values.friends[2].name).toEqual('J');
    insertButton = getByTestId('insert-element');
    act(() => {
      fireEvent.click(insertButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(4);
    expect(values.friends[0].name).toEqual('K');
    expect(values.friends[1].name).toEqual('3');
    expect(values.friends[2].name).toEqual('2');
    expect(values.friends[3].name).toEqual('J');
  });

  it('Should move fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    let moveButton = getByTestId('move-element');
    act(() => {
      fireEvent.click(moveButton);
    });
    let { values } = getProps();
    expect(values.friends).toHaveLength(2);
    expect(values.friends[0].name).toEqual('J');
    expect(values.friends[1].name).toEqual('K')
    moveButton = getByTestId('move-element');
    act(() => {
      fireEvent.click(moveButton);
    });
    ({ values } = getProps());
    expect(values.friends).toHaveLength(2);
    expect(values.friends[1].name).toEqual('J');
    expect(values.friends[0].name).toEqual('K');
  });

  it('Should remove fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    const removeFirstFieldButton = getByTestId('remove-element-0');
    act(() => {
      fireEvent.click(removeFirstFieldButton);
    });
    const { values } = getProps();
    expect(values.friends).toHaveLength(1);
    expect(values.friends[0].name).toEqual('J')
  });

  it('Should replace fields when asked to', () => {
    const { getByTestId, getProps } = makeHookedForm();
    const replace = getByTestId('replace-element');
    act(() => {
      fireEvent.click(replace);
    });
    const { values } = getProps();
    expect(values.friends[1].name).toEqual('hi')
  });

  it('should throw without a component/render', () => {
    // @ts-ignore
    const Comp = ({ fieldId }: { fieldId: string }) => (<FieldArray fieldId={fieldId} id={fieldId} />);


    const makeErroneousHookedForm = (HookedFormOptions?: object, props?: object) => {
      let injectedProps: any;
      const TestHookedForm = () => {
        injectedProps = useFormConnect();
        return <Comp fieldId="name" />
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
    }
    expect(() => makeErroneousHookedForm()).toThrowError(/The FieldArray needs a "component" or a "children" property to function correctly./);
  })
});
