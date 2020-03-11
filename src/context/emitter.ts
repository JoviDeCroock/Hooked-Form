type Force = () => void;

interface EmitMap {
  [fieldId: string]: Set<Force>;
}

const execute = (c: () => void) => {
  c();
};
const mapping: EmitMap = { '*': new Set() };

export function on(fieldId: string | Array<string>, cb: Force) {
  if (!Array.isArray(fieldId)) fieldId = [fieldId];

  const disposers = fieldId.map(f => {
    (mapping[f] || (mapping[f] = new Set())).add(cb);
    return () => {
      if (mapping[f].has(cb)) {
        mapping[f].delete(cb);
      }
    };
  });

  return () => {
    disposers.map(execute);
  };
}

export function emit(fieldId: string | Array<string>) {
  const visited: Array<string> = [];
  if (!Array.isArray(fieldId)) fieldId = [fieldId];

  fieldId.map(f => {
    if (visited.indexOf(f) === -1) {
      (mapping[f] || []).forEach(execute);
      visited.push(f);
    }
  });

  mapping['*'].forEach(execute);
}
