import { ReactElement, RefObject, useEffect, useState } from 'react';
import { Box, CircularProgress } from 'src/ui-components';

export type InfiniteScrollProps = {
  children: ReactElement[];
  scrollableRef: RefObject<HTMLDivElement>;
  totalAmount: number;
  next: () => void;
  scrollThreshold?: number;
};

export const InfiniteScroll = ({
  scrollableRef,
  totalAmount,
  next,
  scrollThreshold = 0,
  children,
  ...props
}: InfiniteScrollProps) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!scrollableRef.current) return;

    const handler = () => {
      const isScrolled = scrollableRef.current!.scrollTop - scrollThreshold <= 0;
      const isSomethingToLoad = children.length < totalAmount;
      if (!isLoadingMore && isScrolled && isSomethingToLoad) {
        next();
        setIsLoadingMore(true);
      }
    };

    scrollableRef.current.addEventListener('scroll', handler);
    return () => {
      scrollableRef.current?.removeEventListener('scroll', handler);
    };
  }, [scrollableRef.current, children.length, totalAmount, scrollThreshold, isLoadingMore]);

  useEffect(() => {
    setIsLoadingMore(false);
  }, [children.length]);

  return (
    <>
      {isLoadingMore && (
        <Box display='flex' justifyContent='center' p={2}>
          <CircularProgress size={25} />
        </Box>
      )}
      {children}
    </>
  );
};
