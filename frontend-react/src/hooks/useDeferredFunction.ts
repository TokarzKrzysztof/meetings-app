import { useEffect, useRef, useState } from 'react';

// function that will run after state update
export const useDeferredFunction = <TParams extends unknown[]>(fn: (...params: TParams) => void) => {
  const [trigger, setTrigger] = useState<{} | null>(null);
  const paramsRef = useRef<TParams>();

  useEffect(() => {
    if (trigger) fn.call(this, ...paramsRef.current!);
  }, [trigger]);

  return (...params: TParams) => {
    paramsRef.current = params;
    setTrigger({});
  };
};
