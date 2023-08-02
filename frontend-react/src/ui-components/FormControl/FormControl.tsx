import {
  FormControlTypeMap,
  default as MuiFormControl,
  FormControlProps as MuiFormControlProps,
} from '@mui/material/FormControl';

export type FormControlProps = {};

export const FormControl = <
  D extends React.ElementType = FormControlTypeMap['defaultComponent']
>({
  ...props
}: MuiFormControlProps<D, { component?: D }> & FormControlProps) => (
  <MuiFormControl {...props}></MuiFormControl>
);
