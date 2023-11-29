import { RefObject, useEffect, useState } from 'react';
import { Icon, IconButton } from 'src/ui-components';

export type ChatGoDownBtnProps = {
  scrollableRef: RefObject<HTMLDivElement>;
  onGoDown: () => void
};

export const ChatGoDownBtn = ({ scrollableRef, onGoDown }: ChatGoDownBtnProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!scrollableRef.current) return;

    const handler = () => {
      const scrolledFromBottomAmount =
        scrollableRef.current!.scrollHeight -
        (scrollableRef.current!.scrollTop + scrollableRef.current!.clientHeight);
      setShow(scrolledFromBottomAmount > 600);
    };

    scrollableRef.current.addEventListener('scroll', handler);
    return () => {
      scrollableRef.current?.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <IconButton
      onClick={onGoDown}
      sx={{
        position: 'sticky',
        bottom: 0,
        alignSelf: 'center',
        // negative margin equal to button height to take no space
        marginTop: '-40px',
        opacity: show ? 1 : 0,
        pointerEvents: !show ? 'none' : undefined,
        transition: '400ms',
      }}
    >
      <Icon name={'keyboard_double_arrow_down'} />
    </IconButton>
  );
};
