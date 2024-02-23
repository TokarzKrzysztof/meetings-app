import {
  ButtonTypeMap,
  default as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material/Button';
import { MouseEventHandler, useMemo } from 'react';
import { Link, To } from 'react-router-dom';

export type ButtonProps<D extends React.ElementType = ButtonTypeMap['defaultComponent']> =
  MuiButtonProps<D, { component?: D }> & {
    buttonOrLink?: {
      isLink: boolean;
      onClick: MouseEventHandler<D> | undefined;
      to: To | undefined;
    };
  };

export const Button = <D extends React.ElementType = ButtonTypeMap['defaultComponent']>({
  variant = 'contained',
  sx,
  buttonOrLink,
  ...props
}: ButtonProps<D>) => {
  const rest = useMemo(() => {
    if (buttonOrLink) {
      if (buttonOrLink.isLink) {
        return { component: Link, to: buttonOrLink.to };
      } else {
        return { onClick: buttonOrLink.onClick };
      }
    }
    return {};
  }, [buttonOrLink]);

  return (
    <MuiButton
      variant={variant}
      sx={{
        textTransform: 'none',
        borderRadius: 25,
        fontSize: variant === 'text' ? 13 : undefined,
        ...sx,
      }}
      {...props}
      {...(rest as Partial<ButtonProps<D>>)}
    ></MuiButton>
  );
};
