import {
  default as MuiDialogContent,
  DialogContentProps as MuiDialogContentProps,
} from '@mui/material/DialogContent';

export type DialogContentProps = MuiDialogContentProps & {};

export const DialogContent = ({ ...props }: DialogContentProps) => (
  <MuiDialogContent {...props}></MuiDialogContent>
);
