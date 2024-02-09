import {
  ButtonTypeMap,
  default as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material/Button';

export type ButtonProps<D extends React.ElementType = ButtonTypeMap['defaultComponent']> =
  MuiButtonProps<D, { component?: D }> & {};

export const Button = <D extends React.ElementType = ButtonTypeMap['defaultComponent']>({
  variant = 'contained',
  sx,
  ...props
}: ButtonProps<D>) => (
  <MuiButton
    {...props}
    variant={variant}
    sx={{
      textTransform: 'none',
      borderRadius: 25,
      fontSize: variant === 'text' ? 13 : undefined,
      ...sx,
    }}
  ></MuiButton>
);
