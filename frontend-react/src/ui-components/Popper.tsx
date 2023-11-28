import { default as MuiPopper, PopperProps as MuiPopperProps } from '@mui/material/Popper';

export type PopperProps = {};

export const Popper = ({ ...props }: MuiPopperProps & PopperProps) => (
  <MuiPopper {...props}></MuiPopper>
);
