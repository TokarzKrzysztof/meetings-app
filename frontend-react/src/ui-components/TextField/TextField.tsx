import {
  default as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
} from '@mui/material/TextField';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type TextFieldProps<Variant extends TextFieldVariants = TextFieldVariants> =
  MuiTextFieldProps<Variant> & {};

export const TextFieldInner = <Variant extends TextFieldVariants = TextFieldVariants>(
  { ...props }: TextFieldProps<Variant>,
  ref: ForwardedRef<HTMLInputElement>,
) => <MuiTextField ref={ref} {...props}></MuiTextField>;

export const TextField = typedForwardRef(TextFieldInner);
