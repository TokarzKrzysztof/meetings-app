import {
  Dispatch,
  HTMLAttributes,
  ReactElement,
  SetStateAction,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';

export type ChatMessageReplyProps = {
  children: ReactElement<React.DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;
  onReply: () => void;
  maxMovement: number;
  moveX: number;
  setMoveX: Dispatch<SetStateAction<number>>;
  direction: 'left' | 'right';
  returnOnDragEnd?: boolean;
};

export const ChatMessageReply = ({
  children,
  onReply,
  maxMovement,
  moveX,
  setMoveX,
  direction,
  returnOnDragEnd = true,
}: ChatMessageReplyProps) => {
  const lastXRef = useRef<number | null>(null);

  const [isTouchStarted, setIsTouchStarted] = useState(false);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      setIsTouchStarted(false);
      if (Math.abs(moveX) === maxMovement) {
        onReply();
      }
      if (returnOnDragEnd) {
        lastXRef.current = null;
        setMoveX(0);
      }
    };

    window.addEventListener('touchend', handler);
    return () => {
      window.removeEventListener('touchend', handler);
    };
  }, [moveX, onReply]);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (!isTouchStarted) return;

      if (lastXRef.current === null) lastXRef.current = e.touches[0].clientX;
      const movementX = e.touches[0].clientX - lastXRef.current;
      lastXRef.current = e.touches[0].clientX;

      setMoveX((prev) => {
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

  return cloneElement(children, {
    // ref: mergeRefs([elementRef, (children as any).ref]),
    style: {
      transform: moveX !== 0 ? `translateX(${moveX}px)` : undefined,
      transition: isTouchStarted ? 'none' : undefined,
    },
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      setIsTouchStarted(true);
      children.props.onTouchStart && children.props.onTouchStart(e);
    },
  });
};
