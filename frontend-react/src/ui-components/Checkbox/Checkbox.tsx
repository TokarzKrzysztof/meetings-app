import {
  default as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material/Checkbox';

export type CheckboxProps = {};

export const Checkbox = ({ ...props }: MuiCheckboxProps & CheckboxProps) => (
  <MuiCheckbox {...props}></MuiCheckbox>
);
