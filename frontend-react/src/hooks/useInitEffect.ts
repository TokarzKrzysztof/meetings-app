import { EffectCallback, useEffect, useRef } from 'react';

export const useInitEffect = (effect: EffectCallback) => {
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      effect();
    }
  }, []);
};
