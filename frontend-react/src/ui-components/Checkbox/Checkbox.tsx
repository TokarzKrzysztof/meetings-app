import {
  default as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material/Checkbox';

export type CheckboxProps = MuiCheckboxProps & {};

export const Checkbox = ({ ...props }: CheckboxProps) => (
  <MuiCheckbox {...props}></MuiCheckbox>
);
