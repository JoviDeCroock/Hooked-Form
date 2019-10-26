type Force = () => void;

interface EmitMap {
  [fieldId: string]: Array<Force>;
}

const mapping: EmitMap = {};
export function on(fieldId: string | Array<string>, cb: Force) {
  if (Array.isArray(fieldId)) {
    const disposers: Array<Force> = [];
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
  if (!mapping[fieldId]) {
    mapping[fieldId] = [];
  }
  mapping[fieldId].push(cb);

  return () => {
    if (mapping[fieldId].indexOf(cb) !== -1) {
      mapping[fieldId].splice(mapping[fieldId].indexOf(cb), 1);
    }
  };
}

export function emit(fieldId: string | Array<string>) {
  if (Array.isArray(fieldId)) {
    fieldId.forEach((f) => { notify(`${f}`); });
  } else {
    notify(`${fieldId}`);
  }
  notify('all');
}

function notify(fieldId: string) {
  if (mapping[fieldId]) {
    mapping[fieldId].forEach((cb) => { cb(); });
  }
}
