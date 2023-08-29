import {
  default as MuiDialogActions,
  DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material/DialogActions';

export type DialogActionsProps = MuiDialogActionsProps & {};

export const DialogActions = ({ ...props }: DialogActionsProps) => (
  <MuiDialogActions {...props}></MuiDialogActions>
);
