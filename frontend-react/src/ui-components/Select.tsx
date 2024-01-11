import { default as MuiSelect, SelectProps as MuiSelectProps } from '@mui/material/Select';

export type SelectProps = {};

export const Select = <T,>({ ...props }: MuiSelectProps<T> & SelectProps) => (
  <MuiSelect variant='standard' {...props}></MuiSelect>
);

Select.muiName = MuiSelect.muiName;
