import {
    default as MuiButton,
    ButtonProps as MuiButtonProps,
} from '@mui/material/Button';
import { FC } from 'react';

export type ButtonProps = MuiButtonProps;

export const Button: FC<ButtonProps> = ({ ...props }) => (
  <MuiButton {...props}>Text</MuiButton>
);
