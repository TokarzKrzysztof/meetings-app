import {
  ButtonTypeMap,
  default as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material/Button';

export type ButtonProps = {};

export const Button = <D extends React.ElementType = ButtonTypeMap['defaultComponent']>({
  variant = 'contained',
  sx,
  ...props
}: MuiButtonProps<D, { component?: D }> & ButtonProps) => (
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
