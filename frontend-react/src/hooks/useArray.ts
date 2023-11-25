import { useState } from 'react';

export const useArray = <T>(initialValue: T[] = []) => {
  const [array, setArray] = useState(initialValue);

  const push = (element: T) => {
    setArray((oldValue) => [...oldValue, element]);
  };

  const remove = (index: number) => {
    setArray((oldValue) => oldValue.filter((_, i) => i !== index));
  };

  return { array, setArray, push, remove };
};
