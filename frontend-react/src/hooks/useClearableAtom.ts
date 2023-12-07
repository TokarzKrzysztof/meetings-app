import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export function useClearableAtom<Value, Args extends unknown[]>(
  atom: Atom<Value> | WritableAtom<Value, Args, void>
) {
  const atomValue = useAtomValue(atom);
  const setAtom = useSetAtom(atom as WritableAtom<Value, Args, void>);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setAtom as any)(null);
    };
  }, []);

  return [atomValue, setAtom] as const;
}
