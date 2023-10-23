import {
  default as MuiFormLabel,
  FormLabelProps as MuiFormLabelProps,
  FormLabelTypeMap,
} from '@mui/material/FormLabel';

export type FormLabelProps<D extends React.ElementType = FormLabelTypeMap['defaultComponent']> =
  MuiFormLabelProps<D, { component?: D }> & {};

export const FormLabel = <D extends React.ElementType = FormLabelTypeMap['defaultComponent']>({
  ...props
}: FormLabelProps<D>) => <MuiFormLabel {...props}></MuiFormLabel>;
