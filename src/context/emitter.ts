import { unstable_batchedUpdates } from '../helpers/batched';

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

  // @ts-ignore
  fieldId.some((f) => {
    if (!mapping[f]) { mapping[f] = []; }

    mapping[f].push(cb);
    disposers.push(() => {
      if (mapping[f].indexOf(cb) !== -1) {
        mapping[f].splice(mapping[f].indexOf(cb), 1);
      }
    });
  });

  // @ts-ignore
  return () => { disposers.some((c) => { c(); }); };
}

export function emit(fieldId: string | Array<string>) {
  const visited: Array<string> = [];
  if (!Array.isArray(fieldId)) {
    fieldId = [fieldId];
  }

  unstable_batchedUpdates(() => {
    // @ts-ignore
    fieldId.some((f) => {
      if (visited.indexOf(f) === -1) {
        notify(f);
        visited.push(f);
      }
    });
    notify('all');
  });
}

function notify(fieldId: string) {
  if (mapping[fieldId]) {
    // @ts-ignore
    mapping[fieldId].some((cb) => { cb(); });
  }
}
