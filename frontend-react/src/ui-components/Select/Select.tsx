import {
  default as MuiSelect,
  SelectProps as MuiSelectProps,
} from '@mui/material/Select';

export type SelectProps = {};

export const Select = <T = unknown,>({
  ...props
}: MuiSelectProps<T> & SelectProps) => <MuiSelect {...props}></MuiSelect>;

Select.muiName = MuiSelect.muiName;
