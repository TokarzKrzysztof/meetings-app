import {
  ButtonTypeMap,
  default as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material/Button';

export type ButtonProps = {};

export const Button = <
  D extends React.ElementType = ButtonTypeMap['defaultComponent']
>({
  ...props
}: MuiButtonProps<D, { component?: D }> & ButtonProps) => (
  <MuiButton {...props}></MuiButton>
);
