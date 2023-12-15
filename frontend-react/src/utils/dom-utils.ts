import { HTMLAttributes } from 'react';

type WithNoPropagationParams = Pick<HTMLAttributes<Element>, 'onClick' | 'onMouseDown' | 'onTouchStart'>;
export const withNoPropagation = ({
  onClick,
  onMouseDown,
  onTouchStart
}: WithNoPropagationParams = {}): WithNoPropagationParams => {
  return {
    // disable link
    onClick: (e) => {
      e.preventDefault();
      onClick && onClick(e);
    },
    // disable ripple
    onMouseDown: (e: React.MouseEvent) => {
      e.stopPropagation();
      onMouseDown && onMouseDown(e);
    },
    // disable ripple mobile
    onTouchStart: (e: React.TouchEvent) => {
      e.stopPropagation();
      onTouchStart && onTouchStart(e);
    },
  };
};
