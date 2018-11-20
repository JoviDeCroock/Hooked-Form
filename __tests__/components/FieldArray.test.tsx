import * as React from 'react';
import { fireEvent, render, wait } from 'react-testing-library';
import { FieldArray, Field, Form } from '../../src';

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

const ArrayContainer = ({ addElement, values, removeElement }: { addElement: (input: object) => void, values: any, removeElement: (input: object | number) => void }) => {
  return (
    <React.Fragment>
      {values.map((value: object, fieldId: string, i: number) => (
        <React.Fragment key={fieldId}>
          <Component key={fieldId} fieldId={`${fieldId}.name`} />
          <button data-testid={`remove-element-${i}`} onClick={() => removeElement(value)}>Delete</button>
        </React.Fragment>
      ))}
      <button data-testid="add-element" onClick={() => addElement({ name: `${values.length}` })}>Add</button>
    </React.Fragment>
  );
}

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    initialValues: { friends: [
      { name: 'K' },
      { name: 'J' },
    ]},
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => (injectedProps = formProps) && (
    <React.Fragment>
      <FieldArray fieldId="friends" component={ArrayContainer} />
    </React.Fragment>
  ));
  return {
    getProps: () => injectedProps,
    ...render(<TestForm {...props} />)
  }
}

describe('FieldArray', () => {
  it('should render the stringfields and handle onChange aswell as validation', () => {
    const { getByTestId } = makeForm({ validate: (values: any) => {
      if (values.friends[0].name === 'A') {
        return {
          friends: [
            { name: 'bad' },
          ]
        }
      }
      return {}
    }});

    const firstFriendField = getByTestId('friends[0].name');
    const secondFriendField = getByTestId('friends[1].name');

    expect((firstFriendField as any).value).toEqual('K');
    expect((secondFriendField as any).value).toEqual('J');
    fireEvent.change(firstFriendField, { target: { value: 'A' } });
    expect((firstFriendField as any).value).toEqual('A');
    fireEvent.change(secondFriendField, { target: { value: 'B' } });
    expect((secondFriendField as any).value).toEqual('B');

    const firstFriendFieldError = getByTestId('friends[0].name-error');
    wait(() => expect(firstFriendFieldError.textContent).toEqual('bad'), { timeout: 100 });
  });

  it('Should add fields when asked to', () => {
    const { getByTestId, getProps } = makeForm();
    const addButton = getByTestId('add-element');
    fireEvent.click(addButton);
    const { values } = getProps();
    wait(() => {
      expect(values.friends).toHaveLength(3);
      expect(values.friends[2].name).toEqual('3')
    }, { timeout: 100 });
  });

  it('Should remove fields when asked to', () => {
    const { getByTestId, getProps } = makeForm();
    const removeFirstFieldButton = getByTestId('remove-element-0');
    fireEvent.click(removeFirstFieldButton);
    const { values } = getProps();
    wait(() => {
      expect(values.friends).toHaveLength(1);
      expect(values.friends[0].name).toEqual('J')
    }, { timeout: 100 });
  });
});
