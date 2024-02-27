import { ReactElement, useEffect } from 'react';
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
      if (!isFetching && isScrolled() && hasMore) {
        next();
        // assign new value to scoped variable
        isFetching = true;
      }
    };

    // call handler in case hasMore and no scroll is shown
    if (direction === 'up') {
      // timeout for direction up because of scroll to previous state delay
      setTimeout(() => {
        handler();
      });
    } else {
      handler();
    }

    scrollable?.addEventListener('scroll', handler);
    return () => {
      scrollable?.removeEventListener('scroll', handler);
    };
  });

  const spinner = <Loader visibility={isFetching ? 'visible' : 'hidden'}></Loader>;
  return (
    <>
      {(isFetching || hasMore) && direction === 'up' && spinner}
      {children}
      {(isFetching || hasMore) && direction === 'down' && spinner}
    </>
  );
};
