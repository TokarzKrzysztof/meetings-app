import {
  DialogTitleTypeMap,
  default as MuiDialogTitle,
  DialogTitleProps as MuiDialogTitleProps,
} from '@mui/material/DialogTitle';

export type DialogTitleProps<
  D extends React.ElementType = DialogTitleTypeMap['defaultComponent']
> = MuiDialogTitleProps<D, { component?: D }> & {};

export const DialogTitle = <
  D extends React.ElementType = DialogTitleTypeMap['defaultComponent']
>({
  ...props
}: DialogTitleProps<D>) => (
  <MuiDialogTitle {...props}></MuiDialogTitle>
);
