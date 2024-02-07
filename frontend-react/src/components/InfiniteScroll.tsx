import { ReactElement, useEffect, useRef } from 'react';
import { Box, CircularProgress } from 'src/ui-components';

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
  // const [isLoadingMore, setIsLoadingMore] = useState(true);

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

  // const setLoading = (value: boolean) => {
  //   setIsLoadingMore(value);
  //   isLoadingMoreRef.current = value;
  // };

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

  const spinner = (
    <Box
      display='flex'
      justifyContent='center'
      p={2}
      // change only visibility to avoid scroll jumping
      visibility={isFetching ? 'visible' : 'hidden'}
    >
      <CircularProgress size={25} />
    </Box>
  );
  return (
    <>
      {(isFetching || hasMore) && direction === 'up' && spinner}
      {children}
      {(isFetching || hasMore) && direction === 'down' && spinner}
    </>
  );
};
