import {
  ForwardedRef,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useInitEffect } from 'src/hooks/useInitEffect';
import { Box, CircularProgress } from 'src/ui-components';
import { typedForwardRef } from 'src/utils/types/forward-ref';

const isWindow = (element: any): element is Window => {
  return element === window;
};

export type InfiniteScrollHandle = {
  load: () => void;
};

export type InfiniteScrollProps = {
  children: ReactElement[];
  scrollable?: HTMLElement | Window | null;
  totalAmount: number;
  next: () => Promise<void>;
  direction: 'up' | 'down';
  scrollThreshold?: number;
  loadOnInit?: boolean;
};

export const InfiniteScrollInner = (
  {
    children,
    scrollable = window,
    totalAmount,
    next,
    direction,
    loadOnInit = true,
    scrollThreshold = 50,
  }: InfiniteScrollProps,
  ref: ForwardedRef<InfiniteScrollHandle>
) => {
  // ref to always get synchronous value
  const isLoadingMoreRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isSomethingToLoad = children.length < totalAmount;

  const isScrolled = () => {
    if (isWindow(scrollable)) {
      if (direction === 'down') {
        return (
          scrollable.innerHeight + scrollable.scrollY + scrollThreshold >=
          document.body.offsetHeight
        );
      }
    } else {
      if (!scrollable) return false;
      if (direction === 'down') {
        return (
          scrollable.clientHeight + scrollable.scrollTop + scrollThreshold >=
          scrollable.scrollHeight
        );
      } else {
        return scrollable.scrollTop - scrollThreshold <= 0;
      }
    }
  };

  const setLoading = (value: boolean) => {
    setIsLoadingMore(value);
    isLoadingMoreRef.current = value;
  };

  const load = () => {
    if (isLoadingMoreRef.current) return;

    setLoading(true);
    next();
    // for testing later
    // next();
  };

  useEffect(() => {
    const handler = () => {
      if (isScrolled() && isSomethingToLoad) {
        load();
      }
    };

    scrollable?.addEventListener('scroll', handler);
    return () => {
      scrollable?.removeEventListener('scroll', handler);
    };
  });

  useEffect(() => {
    setLoading(false)
  }, [children.length]);

  useInitEffect(() => {
    if (loadOnInit) load();
  });

  const spinner = (
    <Box
      display='flex'
      justifyContent='center'
      p={2}
      // change only visibility to avoid scroll jumping
      visibility={isLoadingMore ? 'visible' : 'hidden'}
    >
      <CircularProgress size={25} />
    </Box>
  );
  useImperativeHandle(ref, () => ({ load }), [load]);
  return (
    <>
      {isSomethingToLoad && direction === 'up' && spinner}
      {children}
      {isSomethingToLoad && direction === 'down' && spinner}
    </>
  );
};

export const InfiniteScroll = typedForwardRef(InfiniteScrollInner);
