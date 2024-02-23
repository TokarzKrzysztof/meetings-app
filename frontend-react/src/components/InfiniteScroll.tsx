import { ReactElement, useEffect, useRef } from 'react';
import { Loader } from 'src/components/Loader';

const isWindow = (element: any): element is Window => {
  return element === window;
};

export type InfiniteScrollProps = {
  next: () => void;
  children: ReactElement[];
  hasMore: boolean;
  direction: 'up' | 'down';
  isFetching: boolean;
  scrollThreshold?: number;
  scrollable?: HTMLElement | Window | null;
};

export const InfiniteScroll = ({
  next,
  children,
  hasMore,
  direction,
  isFetching,
  scrollThreshold = 50,
  scrollable = window,
}: InfiniteScrollProps) => {
  // ref to always get synchronous value
  const isFetchingRef = useRef(false);

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

  useEffect(() => {
    const handler = () => {
      if (!isFetchingRef.current && isScrolled() && hasMore) {
        isFetchingRef.current = true;
        next();
      }
    };

    scrollable?.addEventListener('scroll', handler);
    return () => {
      scrollable?.removeEventListener('scroll', handler);
    };
  });

  useEffect(() => {
    if (!isFetching) {
      isFetchingRef.current = false;
    }
  }, [isFetching]);

  const spinner = <Loader visibility={isFetching ? 'visible' : 'hidden'}></Loader>;
  return (
    <>
      {(isFetching || hasMore) && direction === 'up' && spinner}
      {children}
      {(isFetching || hasMore) && direction === 'down' && spinner}
    </>
  );
};
