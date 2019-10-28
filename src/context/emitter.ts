type Force = () => void;

interface EmitMap {
  [fieldId: string]: Array<Force>;
}

const mapping: EmitMap = {};
export function on(fieldId: string | Array<string>, cb: Force) {
  const disposers: Array<Force> = [];
  if (!Array.isArray(fieldId)) {
    fieldId = [fieldId];
  }

  fieldId.forEach((f) => {
    if (!mapping[f]) { mapping[f] = []; }

    mapping[f].push(cb);
    disposers.push(() => {
      if (mapping[f].indexOf(cb) !== -1) {
        mapping[f].splice(mapping[f].indexOf(cb), 1);
      }
    });
  });

  return () => { disposers.forEach((c) => { c(); }); };
}

export function emit(fieldId: string | Array<string>) {
  const visited: Array<string> = [];
  if (!Array.isArray(fieldId)) {
    fieldId = [fieldId];
  }

  fieldId.forEach((f) => {
    if (visited.indexOf(f) === -1) {
      notify(`${f}`);
      visited.push(f);
    }
  });
  notify('all');
}

function notify(fieldId: string) {
  if (mapping[fieldId]) {
    mapping[fieldId].forEach((cb) => { cb(); });
  }
}
