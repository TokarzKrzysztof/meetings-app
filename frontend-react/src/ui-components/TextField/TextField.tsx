import {
  default as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
} from '@mui/material/TextField';

export type TextFieldProps = {};

export const TextField = <
  Variant extends TextFieldVariants = TextFieldVariants
>({
  ...props
}: MuiTextFieldProps<Variant> & TextFieldProps) => (
  <MuiTextField {...props}></MuiTextField>
);
