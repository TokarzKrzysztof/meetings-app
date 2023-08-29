import {
  default as MuiDialogContentText,
  DialogContentTextProps as MuiDialogContentTextProps,
  DialogContentTextTypeMap,
} from '@mui/material/DialogContentText';

export type DialogContentTextProps<
  D extends React.ElementType = DialogContentTextTypeMap['defaultComponent']
> = MuiDialogContentTextProps<D, { component?: D }> & {};

export const DialogContentText = <
  D extends React.ElementType = DialogContentTextTypeMap['defaultComponent']
>({
  ...props
}: DialogContentTextProps<D>) => (
  <MuiDialogContentText {...props}></MuiDialogContentText>
);
