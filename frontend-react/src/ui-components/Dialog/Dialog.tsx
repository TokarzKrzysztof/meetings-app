import { default as MuiDialog, DialogProps as MuiDialogProps } from '@mui/material/Dialog';

export type DialogProps = MuiDialogProps & {};

export const Dialog = ({ ...props }: DialogProps) => <MuiDialog {...props}></MuiDialog>;
