import { ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from 'src/ui-components';

export type InfiniteScrollProps = {
  children: ReactElement[];
  scrollableRef: RefObject<HTMLDivElement>;
  totalAmount: number;
  next: () => Promise<void>;
  scrollThreshold?: number;
  loadOnInit?: boolean;
};

export const InfiniteScroll = ({
  children,
  scrollableRef,
  totalAmount,
  next,
  scrollThreshold = 0,
  loadOnInit = true,
}: InfiniteScrollProps) => {
  const isInitRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isSomethingToLoad = children.length < totalAmount;

  useEffect(() => {
    const handler = () => {
      const isScrolled = scrollableRef.current!.scrollTop - scrollThreshold <= 0;
      if (!isLoadingMore && isScrolled && isSomethingToLoad) {
        setIsLoadingMore(true);
        next().then(() => {
          setIsLoadingMore(false);
        });
      }
    };

    if (loadOnInit && isInitRef.current === false) {
      handler();
      isInitRef.current = true;
    }

    scrollableRef.current!.addEventListener('scroll', handler);
    return () => {
      scrollableRef.current?.removeEventListener('scroll', handler);
    };
  }, [next, isSomethingToLoad, scrollThreshold, isLoadingMore]);

  return (
    <>
      {isSomethingToLoad && (
        // change only visibility to avoid scroll jumping
        <Box
          display='flex'
          justifyContent='center'
          p={2}
          visibility={isLoadingMore ? 'visible' : 'hidden'}
        >
          <CircularProgress size={25} />
        </Box>
      )}
      {children}
    </>
  );
};
