import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Field, FieldArray } from 'form-hooks';

import { StringField } from './fields';

const ArrayTryout = ({ addElement, values, fieldId }) => (
  <React.Fragment>
    {values.map((value, childFieldId) => <Field key={childFieldId} component={StringField} fieldId={`${childFieldId}.name`} />)}
    <button type="button" onClick={() => addElement()}>Add {fieldId}</button>
  </React.Fragment>
);

function renderFamily(props) {
  // console.log(props);
  return <p>hi</p>;
}

const App = ({ handleSubmit }) => (
  <form className="App" onSubmit={handleSubmit}>
    <Field component={StringField} fieldId="name" />
    <FieldArray component={ArrayTryout} fieldId="friends" />
    <FieldArray render={renderFamily} fieldId="family" />
    <button type="submit">Submit</button>
  </form>
);

const AppContainer = Form({
  initialValues: {
    friends: [],
    name: 'Jovi',
  },
  onSubmit: console.log,
  validate: (values) => {
    // console.log('validating', values);
    if (!values.name || values.name.length < 2) {
      return { name: 'Short' };
    }
    return {};
  },
  validateOnBlur: true,
  validateOnChange: true,
})(App);

const render = () => {
  ReactDOM.render(
    <AppContainer />,
    document.getElementById('root'),
  );
};

// Initial render
document.body.innerHTML += '<div id="root"></div>';
render();
