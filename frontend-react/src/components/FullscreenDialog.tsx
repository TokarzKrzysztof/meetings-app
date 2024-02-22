import { TransitionProps } from 'notistack';
import { forwardRef } from 'react';
import { Dialog, DialogProps, Slide } from 'src/ui-components';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export type FullscreenDialogProps = Omit<DialogProps, 'TransitionComponent' | 'fullScreen'> & {};

export const FullscreenDialog = ({ ...props }: FullscreenDialogProps) => {
  return (
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      {...props}
    />
  );
};
