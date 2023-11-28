import {
  default as MuiFormControlLabel,
  FormControlLabelProps as MuiFormControlLabelProps,
} from '@mui/material/FormControlLabel';

export type FormControlLabelProps = MuiFormControlLabelProps & {};

export const FormControlLabel = ({ ...props }: FormControlLabelProps) => (
  <MuiFormControlLabel {...props}></MuiFormControlLabel>
);
