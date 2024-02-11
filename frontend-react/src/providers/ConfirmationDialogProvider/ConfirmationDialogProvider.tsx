import { atom, useAtom } from 'jotai';
import { ReactElement, ReactNode } from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'src/ui-components';
import { PropsWithReactElement } from 'src/utils/types/props';

export type ConfirmationDialogData = {
  message: ReactElement<typeof DialogContentText>;
  onAccept: () => void;
  onCancel?: () => void;
  title?: string;
  confirmButtonText?: ReactNode;
  ConfirmButtonProps?: ButtonProps<'button'>;
  cancelButtonText?: ReactNode;
  CancelButtonProps?: ButtonProps<'button'>;
};
export const confirmationDialogAtom = atom<ConfirmationDialogData | null>(null);

export type ConfirmationDialogProviderProps = PropsWithReactElement;

export const ConfirmationDialogProvider = ({ children }: ConfirmationDialogProviderProps) => {
  const [dialog, setDialog] = useAtom(confirmationDialogAtom);

  const onCancel = () => {
    dialog!.onCancel && dialog!.onCancel();
    setDialog(null);
  };

  const onAccept = () => {
    dialog!.onAccept();
    setDialog(null);
  };

  if (!dialog) return children;
  return (
    <>
      {children}
      <Dialog open onClose={onCancel}>
        <DialogTitle>{dialog.title ?? 'Potwierdzenie'}</DialogTitle>
        <DialogContent>{dialog.message}</DialogContent>
        <DialogActions>
          <Button variant='text' onClick={onCancel} {...dialog.CancelButtonProps}>
            {dialog.cancelButtonText ?? 'Nie'}
          </Button>
          <Button autoFocus onClick={onAccept} {...dialog.ConfirmButtonProps}>
            {dialog.confirmButtonText ?? 'Tak'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
