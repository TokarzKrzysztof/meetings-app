import { default as MuiModal, ModalProps as MuiModalProps } from '@mui/material/Modal';

export type ModalProps = MuiModalProps<'div'> & {
  disableEventBubbling?: boolean;
};

export const Modal = ({ disableEventBubbling, ...props }: ModalProps) => {
  const disableEventBubblingProps = disableEventBubbling
    ? {
        onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
        onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
        onMouseUp: (e: React.MouseEvent) => e.stopPropagation(),
        onMouseLeave: (e: React.MouseEvent) => e.stopPropagation(),
        onTouchEnd: (e: React.TouchEvent) => e.stopPropagation(),
        onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
      }
    : undefined;

  return <MuiModal {...props} {...disableEventBubblingProps}></MuiModal>;
};
