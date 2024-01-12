import { ReactElement, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from 'src/ui-components';

const isWindow = (element: any): element is Window => {
  return element === window;
};

export type InfiniteScrollProps = {
  next: () => void;
  children: ReactElement[];
  hasMore: boolean;
  direction: 'up' | 'down';
  scrollThreshold?: number;
  scrollable?: HTMLElement | Window | null;
};

export const InfiniteScroll = ({
  next,
  children,
  hasMore,
  direction,
  scrollThreshold = 50,
  scrollable = window,
}: InfiniteScrollProps) => {
  // ref to always get synchronous value
  const isLoadingMoreRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  useEffect(() => {
    const handler = () => {
      if (!isLoadingMoreRef.current && isScrolled() && hasMore) {
        setLoading(true);
        next();
      }
    };

    scrollable?.addEventListener('scroll', handler);
    return () => {
      scrollable?.removeEventListener('scroll', handler);
    };
  });

  useEffect(() => {
    setLoading(false);
  }, [children.length]);

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
  return (
    <>
      {hasMore && direction === 'up' && spinner}
      {children}
      {hasMore && direction === 'down' && spinner}
    </>
  );
};
