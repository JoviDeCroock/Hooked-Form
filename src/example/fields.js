import React from 'react';

export const StringField = ({
 error, onBlur, onChange, value 
}) => (
  <React.Fragment>
    <input onChange={e => onChange(e.currentTarget.value)} value={value} onBlur={onBlur} />
    <p>{error}</p>
  </React.Fragment>
);


export const x = () => {};
