import { styled } from '@mui/material';
import { HTMLAttributes, ReactElement, cloneElement, useEffect, useRef, useState } from 'react';
import { Icon } from 'src/ui-components';
import { shouldNotForwardPropsWithKeys } from 'src/utils/types/should-not-forward-props';

type ReplyIconProps = { maxMovement: number };
const StyledReplyIcon = styled(Icon, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<ReplyIconProps>(['maxMovement']),
})<ReplyIconProps>(({ maxMovement }) => ({
  position: 'absolute',
  right: -maxMovement,
  top: '50%',
  transform: 'translateY(-50%)',
}));

export type ChatMessageReplyProps = {
  children: ReactElement<React.DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;
  onReply: () => void;
  direction?: 'left' | 'right';
  returnOnDragEnd?: boolean;
};

export const ChatMessageReply = ({
  children,
  onReply,
  direction = 'left',
  returnOnDragEnd = true,
}: ChatMessageReplyProps) => {
  const maxMovement = 50;
  const lastXRef = useRef<number | null>(null);
  const [transformX, setTransformX] = useState(0);
  const [isTouchStarted, setIsTouchStarted] = useState(false);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      setIsTouchStarted(false);
      if (Math.abs(transformX) === maxMovement) {
        onReply();
      }
      if (returnOnDragEnd) {
        lastXRef.current = null;
        setTransformX(0);
      }
    };

    window.addEventListener('touchend', handler);
    return () => {
      window.removeEventListener('touchend', handler);
    };
  }, [transformX, onReply]);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (!isTouchStarted) return;

      if (lastXRef.current === null) lastXRef.current = e.touches[0].clientX;
      const movementX = e.touches[0].clientX - lastXRef.current;
      lastXRef.current = e.touches[0].clientX;

      setTransformX((prev) => {
        const newTransform = prev + movementX;

        if (direction === 'left') {
          if (newTransform > 0) return 0;
          if (Math.abs(newTransform) > maxMovement) return -maxMovement;
          return newTransform;
        } else {
          if (newTransform < 0) return 0;
          if (Math.abs(newTransform) > maxMovement) return maxMovement;
          return newTransform;
        }
      });
    };

    window.addEventListener('touchmove', handler);
    return () => {
      window.removeEventListener('touchmove', handler);
    };
  }, [isTouchStarted]);

  return (
    <>
      {cloneElement(
        children,
        {
          // ref: mergeRefs([elementRef, (children as any).ref]),
          style: {
            transform: `translateX(${transformX}px)`,
            transition: isTouchStarted ? 'none' : undefined,
          },
          onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
            setIsTouchStarted(true);
            children.props.onTouchStart && children.props.onTouchStart(e);
          },
        },
        <>
          {children.props.children}
          {transformX !== 0 && (
            <StyledReplyIcon name='reply' color='primary' maxMovement={maxMovement} />
          )}
        </>
      )}
    </>
  );
};
