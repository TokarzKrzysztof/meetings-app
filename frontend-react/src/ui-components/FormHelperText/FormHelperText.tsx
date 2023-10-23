import {
  default as MuiFormHelperText,
  FormHelperTextProps as MuiFormHelperTextProps,
  FormHelperTextTypeMap,
} from '@mui/material/FormHelperText';

export type FormHelperTextProps<
  D extends React.ElementType = FormHelperTextTypeMap['defaultComponent'],
> = MuiFormHelperTextProps<D, { component?: D }> & {};

export const FormHelperText = <
  D extends React.ElementType = FormHelperTextTypeMap['defaultComponent'],
>({
  ...props
}: FormHelperTextProps<D>) => <MuiFormHelperText {...props}></MuiFormHelperText>;
