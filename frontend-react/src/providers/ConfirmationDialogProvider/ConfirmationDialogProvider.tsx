import { useAtom } from 'jotai';
import { ReactElement } from 'react';
import { confirmationDialogAtom } from 'src/store/store';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'src/ui-components';

export type ConfirmationDialogProviderProps = {
  children: ReactElement;
};

export const ConfirmationDialogProvider = ({
  children,
}: ConfirmationDialogProviderProps) => {
  const [dialog, setDialog] = useAtom(confirmationDialogAtom);

  if (!dialog) return children;

  const onCancel = () => {
    dialog.onCancel && dialog.onCancel();
    setDialog(null);
  };

  const onAccept = () => {
    dialog.onAccept();
    setDialog(null);
  };

  return (
    <>
      {children}
      <Dialog open onClose={onCancel}>
        <DialogTitle>{dialog.title ?? 'Potwierdzenie'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='text' onClick={onCancel}>
            Nie
          </Button>
          <Button autoFocus onClick={onAccept}>
            Tak
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
