// @ts-ignore
import { Form, Field, FieldArray } from '../../dist/prod/hooked-form';
import * as React from 'react';
import { act as nativeAct, cleanup, render, fireEvent } from 'react-testing-library';
const { createElement } = React;

let act = nativeAct;
if (!act) {
  const { act: preactAct } = require('preact/test-utils');
  act = preactAct
}

let perfArray: any = []

// @ts-ignore
const StringField = ({ onChange, value, label, i }) => {
  const onChangeCb = React.useCallback((e) => {
    const start = performance.now();
    act(() => {
      onChange(e.target.value);
    })
    perfArray.push(performance.now() - start);
  }, [onChange]);
  return (
    <div>
      {label}
      <input data-testid={`${i}`} onChange={onChangeCb} value={value} />
    </div>
  );
}

// @ts-ignore
function App({ handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <FieldArray
        fieldId="fields"
        // @ts-ignore
        render={({ value }) => {
          // @ts-ignore
          return value.map((_, i) => (
            <Field key={i} i={i} label="title" fieldId={`fields[${i}].title`} component={StringField} />
          ))
        }}
      />
    </form>
  );
}

// @ts-ignore
const AppForm = Form({ mapPropsToValues: ({ fields }) => ({ fields }) })(App);
// @ts-ignore
const AppForm2 = Form({ mapPropsToValues: ({ fields }) => ({ fields }) })(App);
// @ts-ignore
const AppForm3 = Form({ mapPropsToValues: ({ fields }) => ({ fields }) })(App);

const array10 = new Array(10).fill({ title: '' });
const array100 = new Array(100).fill({ title: '' });
const array500 = new Array(500).fill({ title: '' });

describe.only('Stress-Test', () => {
  afterEach(() => {
    perfArray = [];
    cleanup();
  })

  it('should preform well for a relatively small FieldArray', () => {
    const { getByTestId } = render(<AppForm fields={array10} />);
    // @ts-ignore
    let input = getByTestId('0');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('9');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('4');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }


    const sum = perfArray.reduce((acc: any, num: number) => acc + num);
    const average = sum / 150;
    expect(perfArray.length).toBe(150);
    expect(average).toBeLessThan(1);
    console.log('avg', average);
  });

  it('should perform well for a bigger FieldArray (100elem) < 1ms', () => {
    const { getByTestId } = render(<AppForm2 fields={array100} />);
    // @ts-ignore
    let input = getByTestId('0');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('22');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('97');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }


    const sum = perfArray.reduce((acc: any, num: number) => acc + num);
    const average = sum / 150;
    expect(perfArray.length).toBe(150);
    expect(average).toBeLessThan(1);
    console.log('avg', average);
  });

  it('should perform well for a bigger FieldArray (500 elem) < 1ms', () => {
    const { getByTestId } = render(<AppForm3 fields={array500} />);
    // @ts-ignore
    let input = getByTestId('0');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('22');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    input = getByTestId('97');
    for(let i = 0; i < 50; i++) {
      fireEvent.change(input, { target: { value: i } })
    }

    const sum = perfArray.reduce((acc: any, num: number) => acc + num);
    const average = sum / 150;
    expect(perfArray.length).toBe(150);
    expect(average).toBeLessThan(1);
    console.log('avg', average);
  });
});
