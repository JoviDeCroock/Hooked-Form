type Force = () => void;

type SubField = 'error' | 'default' | 'value' | 'touched';

interface EmitMap {
  [fieldId: string]: {
    default?: Array<Force>;
    error?: Array<Force>;
    value?: Array<Force>;
    touched?: Array<Force>;
  };
}

const mapping: EmitMap = {};

export function on(fieldId: string, cb: Force, subField?: SubField | Array<SubField>) {
  subField = subField || 'default';
  if (!mapping[fieldId]) {
    mapping[fieldId] = {};
  }
  if (Array.isArray(subField)) {
    const disposers: Array<Force> = [];
    subField.forEach((sf) => {
      if (mapping[fieldId][sf]) {
        // @ts-ignore
        mapping[fieldId][sf].push(cb);
      } else {
        mapping[fieldId][sf] = [cb];
      }
      disposers.push(() => {
        // @ts-ignore
        if (mapping[fieldId][subField].indexOf(cb) !== -1) {
          // @ts-ignore
          mapping[fieldId][subField].splice(mapping[fieldId][subField].indexOf(cb), 1);
        }
      });
    });

    return () => {
      disposers.forEach(c => c());
    };
  }
  if (mapping[fieldId][subField]) {
    // @ts-ignore
    mapping[fieldId][subField].push(cb);
  } else {
    mapping[fieldId][subField] = [cb];
  }

  return () => {
    // @ts-ignore
    if (mapping[fieldId][subField].indexOf(cb) !== -1) {
      // @ts-ignore
      mapping[fieldId][subField].splice(mapping[fieldId][subField].indexOf(cb), 1);
    }
  };
}

export function emit(fieldId: string, subField?: SubField) {
  subField = subField || 'default';
  if (fieldId === 'ALL') {
    // TODO: call all of them.
  } else if (mapping[fieldId][subField]) {
    // @ts-ignore
    mapping[fieldId][subField].forEach(cb => cb());
  }
}
