import { useCallback, useEffect, useRef, useState } from 'react';

export const useStateWithCallback = <T>(initialValue: T) => {
  const callbackRef = useRef<(value: T) => void>();

  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value);
      callbackRef.current = undefined;
    }
  }, [value]);

  const setValueWithCallback = useCallback(
    (newValue: T | ((prev: T) => T), onChanged?: (value: T) => void) => {
      callbackRef.current = onChanged;
      setValue(newValue);
    },
    []
  );

  return [value, setValueWithCallback] as const;
};
